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
      <div className="pb-16 md:pt-4 md:pb-14">
        <Header enableAuthentication={false} />
      </div>
      <div className="flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24">
        <h1 className="my-8 text-2xl text-center sm:text-3xl md:text-4xl lg:text-6xl">{details?.title}</h1>
        <div className="flex flex-col items-center justify-between mb-8 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
            <h2 className="text-gray-300">{formattedReleaseDate}</h2>
            <h2 className="text-gray-300">{formattedRuntime}</h2>
          </div>
          <div className="flex gap-4">
            <div className="flex gap-2 px-2 py-1 bg-gray-100 rounded-md bg-opacity-20">
              <span className="relative group">
                <img
                  className="w-6 h-6"
                  src={rate ? "https://img.icons8.com/fluency/48/star--v1.png" : "https://img.icons8.com/ios/50/737373/star--v1.png"}
                  alt="Rate"
                />
                <div className="absolute hidden group-hover:flex top-full">
                  <Rating onRatingChanged={handleRatingChanged} />
                </div>
              </span>
              <button className="text-sm">Rate</button>
            </div>
            <div className="flex gap-2 px-2 py-1 bg-gray-100 rounded-md bg-opacity-20">
              <img className="w-6 h-6" src="https://img.icons8.com/fluency/48/star--v1.png" alt="star" />
              <h2 className="text-sm">{details?.vote_average.toFixed(1)}/10</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center px-4 space-y-8 lg:flex-row sm:px-8 md:px-16 lg:px-24 lg:space-y-0 lg:space-x-8">
        <div className="flex justify-center lg:w-1/3">
          <img className="h-auto max-w-full rounded-lg shadow-lg" src={imgUrl} alt={details?.title} />
        </div>
        <div className="flex flex-col space-y-6 lg:w-2/3">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="text-sm sm:text-base">{details?.overview}</p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Genre</h2>
            <div className="flex flex-wrap gap-2">
              {details?.genres.map((genre) => (
                <span key={genre.id} className="px-3 py-1 text-sm bg-white rounded-full bg-opacity-20">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={addToWatchList}
            className="w-full sm:w-auto px-6 py-2 text-black bg-[#f5c518] rounded-md hover:bg-[#d4a91d] transition-colors"
          >
            {watchList ? "Added to watchlist" : "Add to watchlist"}
          </button>
          <div className="space-y-2">
            <div className="flex">
              <h2 className="w-24 font-semibold">Director:</h2>
              <p className="text-yellow-500">{director}</p>
            </div>
            <div className="flex">
              <h2 className="w-24 font-semibold">Stars:</h2>
              <p className="text-yellow-500">{actor}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 mt-12 sm:px-8 md:px-16 lg:px-24">
        <Photos />
        <h2 className="mt-12 mb-6 text-2xl font-semibold">Cast</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {cast?.slice(0, 8).map((castMember) => (
            <div key={castMember.id} className="flex flex-col items-center">
              <Link to={personId ? `/person/${personId}` : "#"} onClick={() => fetchPerson(castMember?.original_name)}>
                {castMember.profile_path && (
                  <img
                    className="object-cover w-32 h-48 mb-2 rounded-md shadow-md"
                    src={IMG_CDN + castMember?.profile_path}
                    alt={castMember?.original_name}
                  />
                )}
              </Link>
              <h3 className="text-sm font-semibold text-center">{castMember?.original_name}</h3>
              <p className="text-xs text-center text-gray-400">{castMember?.character}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 mt-12 sm:px-8 md:px-16 lg:px-24">
        <h2 className="mb-6 text-2xl font-semibold">More like this</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {similar.map((movie) => (
            <MovieCard
              key={movie.id}
              posterPath={movie?.poster_path}
              id={movie.id}
              rating={movie.vote_average.toFixed(1)}
              trimmedTitle={movie.title.length > 15 ? movie.title.slice(0, 15) + "..." : movie.title}
              release_date={movie.release_date}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
