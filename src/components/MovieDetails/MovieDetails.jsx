import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { IMG_CDN, IMG_CDN_ORG, OPTIONS } from "../../utils/constants";
import MovieCard from "../MovieCard";
import useDebounce from "../../hooks/useDebounce";
import Header from "../MainContainer/Header";
import Rating from "../MainContainer/rating";
import "./MovieDetails.css";
// import ImageAmbilight from "../../utils/ImageEffect/ImageAmbilight";
import Photos from "./Photos";
import useAddToWatchlist from "../../hooks/useAddToWatchlist";

const MovieDetails = () => {

  const { movieId } = useParams();
  const [movieData, setMovieDate] = useState({
    details: "",
    images: [],
    reviews: null,
    similar: [],
    cast: [],
    trailerVideo: "",
    director: "",
    actor: "",
    suggestions: []
  })

  const [userInteraction, setUserInteraction] = useState({
    fav: false,
    rating: "",
    rate: false
  })

  const [personId, setPersonId] = useState(null);
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const debouncedSearchTerm = useDebounce(searchTerm, 800)

  const fetchMovieData = useCallback(async () => {
    try {
      const [details, images, reviews, similar, credits, videos, suggestions] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, OPTIONS).then(res => res.json()),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, OPTIONS).then(res => res.json()),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews`, OPTIONS).then(res => res.json()),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar`, OPTIONS).then(res => res.json()),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, OPTIONS).then(res => res.json()),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`, OPTIONS).then(res => res.json()),
        fetch(`https://api.themoviedb.org/3/search/multi?query=${debouncedSearchTerm}&include_adult=false&language=en-US&page=1`, OPTIONS).then(res => res.json())
      ]);

      const director = credits.crew.find(member => member.job === "Director")?.name || "";
      const actor = credits.cast.slice(0, 3).map(actor => actor.name).join(", ");
      const trailerVideo = videos.results.find(video => video.type === "Trailer") || videos.results[0] || "";

      setMovieDate({
        details,
        images: images.backdrops,
        reviews,
        similar: similar.results,
        cast: credits.cast,
        trailerVideo,
        director,
        actor,
        suggestions
      })
    } catch (error) {
      console.error("Error fetching movie data:", error);
      setError("Failed to fetch movie data");
    }
  }, [movieId])


  useEffect(() => {
    try {
      const favoritesFromStorage = JSON.parse(localStorage.getItem("favorites") || "[]");
      const watchListsFromStorage = JSON.parse(localStorage.getItem("WatchList") || "[]");

      setUserInteraction(prev => ({
        ...prev,
        fav: favoritesFromStorage.some(movie => movie.id === parseInt(movieId)),
        watchList: watchListsFromStorage.some(movie => movie.id === parseInt(movieId)),
      }));
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
    }
  }, [movieId]);

  const handleRatingChanged = useCallback((newRating) => {
    setUserInteraction(prev => ({ ...prev, rating: newRating, rate: true }));
    addRating(newRating);
  }, []);

  const { details, images, reviews, similar, cast, trailerVideo, director, actor } = movieData;
  const { fav, rating, rate } = userInteraction;

  const { watchList, addToWatchList, checkWatchListStatus } = useAddToWatchlist(movieId, details)

  useEffect(() => {
    fetchMovieData();
    checkWatchListStatus();
  }, [fetchMovieData, checkWatchListStatus]);

  const addRating = useCallback((newRating) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/rating`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + process.env.REACT_APP_TMDB_KEY,
      },
      body: JSON.stringify({ value: newRating }),
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => {
        console.error("error:" + err);
        setError("Failed to add rating");
      });
  }, [movieId]);

  const fetchPerson = useCallback(async (personName) => {
    try {
      const encodedPersonName = encodeURIComponent(personName);
      const data = await fetch(
        `https://api.themoviedb.org/3/search/person?query=${encodedPersonName}&include_adult=false&language=en-US&page=1`,
        OPTIONS
      );
      const json = await data.json();
      const id = json.results[0]?.id;
      setPersonId(id);
    } catch (error) {
      console.error("Error fetching person:", error);
      setError("Failed to fetch person information");
    }
  }, []);

  const formatMinutes = minutes => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = releaseDate => {
    const date = new Date(releaseDate);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  };


  const formattedRuntime = useMemo(() => formatMinutes(details?.runtime), [details?.runtime, formatMinutes]);
  const formattedReleaseDate = useMemo(() => formatDate(details?.release_date), [details?.release_date, formatDate]);


  if (error) return <div>Error: {error}</div>;
  if (!movieData.details) return <div>Loading...</div>;

  const imgUrl = IMG_CDN_ORG + details?.poster_path;

  return (
    <div className="w-full text-white font-roboto">
      <div className="flex pb-16 md:pt-4 md:pb-14">
        <Header enableAuthentication={false} />
      </div>
      <div className="flex flex-col px-18 md:px-48">
        <div>
          <h1 className="my-8 text-3xl md:text-6xl">{details?.title}</h1>
        </div>
        <div className="flex items-center justify-between mx-4 md:mx-10 md:gap-10 ">
          <div className="flex md:gap-6">
            <h2 className="text-gray-300">{formattedReleaseDate}</h2>
            <h2 className="text-gray-300">{formattedRuntime}</h2>
          </div>
          <div className="flex gap-10">
            <div className="flex gap-2 px-2 py-1 bg-gray-100 rounded-md border-1 bg-opacity-20">
              <span className=" group">
                <img
                  className="w-7"
                  src={
                    rate
                      ? "https://img.icons8.com/fluency/48/star--v1.png"
                      : "https://img.icons8.com/ios/50/737373/star--v1.png"
                  }
                />
                <div className="absolute hidden group-hover:flex top-32">
                  {" "}
                  <Rating onRatingChanged={handleRatingChanged} />
                </div>
              </span>
              <button className="my-auto">Rate</button>
            </div>
            <div className="flex gap-2 px-2 py-1 bg-gray-100 rounded-md border-1 bg-opacity-20">
              <img
                className="object-contain w-6 "
                src="https://img.icons8.com/fluency/48/star--v1.png"
                alt="star--v1"
              />
              <h2 className="my-auto">
                {details?.vote_average.toFixed(1)}/10
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="justify-center px-4 mt-10 md:px-44 md:flex-col md:flex">
        <div className="flex flex-col gap-5 mx-auto md:gap-20 w-60 md:w-full md:flex-row">
          <img className="max-w-96" src={imgUrl}/>
          {/* <iframe
            className="w-full aspect-video"
            src={
              "https://www.youtube.com/embed/" + trailerVideo?.key
              // " + ?&autoplay=1&mute=1"
            }
            title="YouTube video player"
            allow="accelerometer; autoplay;clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe> */}
        </div>
        <div className="flex flex-col gap-10 my-10">
          <div className="flex flex-col gap-10 md:flex-row">
            <h2 className="mx-auto md:text-xl w-18">Overview</h2>
            <h3 className="md:text-xl">{details?.overview}</h3>
          </div>
          <div className="flex items-center gap-10">
            <h2 className="text-xl md:w-52">Genre</h2>
            <div className="flex flex-wrap md:gap-20">
              {details &&
                details.genres.map((genre) => (
                  <button
                    key={genre.id}
                    className="flex items-center justify-center h-10 px-5 text-gray-100 bg-white bg-opacity-40 rounded-2xl"
                  >
                    <h3>{genre.name}</h3>
                  </button>
                ))}
            </div>

            <button
              onClick={addToWatchList}
              className="flex justify-center px-6 py-2 m-4 mx-auto text-black bg-[#f5c518] rounded-md w-48"
            >
              {watchList ? "Added to watchList" : "Add to watchList"}
            </button>
          </div>
          <div className="flex gap-10">
            <h2 className="md:text-xl md:w-52">Director</h2>
            <h3 className="text-yellow-500 md:text-xl">{director}</h3>
          </div>
          <div className="flex gap-10">
            <h2 className="md:text-xl md:w-52">Stars</h2>
            <h3 className="text-yellow-500 md:text-xl">{actor}</h3>
          </div>
        </div>
        <Photos />
        <h2 className="text-3xl ">Cast: </h2>
        <div className="flex flex-wrap justify-center gap-10 ">
          {cast?.map((castMember) => (
            <div className="flex flex-col flex-wrap" key={castMember.id}>
              <Link to={personId ? `/person/${personId}` : "#"}>
                {castMember.profile_path ? (
                  <img
                    onClick={() => fetchPerson(castMember?.original_name)}
                    className="object-cover w-20 rounded-md h-36 md:w-32"
                    src={IMG_CDN + castMember?.profile_path}
                    alt={castMember?.original_name}
                  />
                ) : null}
              </Link>
              <h1 className="font-bold">
                {window.innerWidth < 768
                  ? castMember?.original_name.slice(0, 10) + "..."
                  : castMember?.original_name.slice(0, 15) + "..."}
              </h1>
              <h2>
                {window.innerWidth < 768
                  ? castMember?.character.slice(0, 10) + "..."
                  : castMember?.character.slice(0, 15) + "..."}
              </h2>
            </div>
          )).slice(0, 8)}
        </div>
        <h1 className="p-5 my-10 text-5xl ">More like this</h1>
        <div className="flex flex-wrap justify-center gap-10 md:flex-row md:justify-center ">
          {similar.map((movie) => (
            <MovieCard
              className="flex flex-wrap justify-center gap-10 p-1 m-2 md:p-5 md:m-5"
              key={movie.id}
              posterPath={movie?.poster_path}
              id={movie.id}
              rating={movie.vote_average.toFixed(1)}
              trimmedTitle={
                movie.title.length > 10
                  ? movie.title.slice(0, 15) + "..."
                  : movie.title
              }
              release_date={movie.release_date}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
