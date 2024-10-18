import React, { useEffect, useState } from "react";
import { OPTIONS } from "../utils/constants";
import MovieCard from "./MovieCard";
import Header from "./MainContainer/Header";

const ExploreMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/discover/movie?page=${page}`,
        OPTIONS
      );
      const json = await data.json();
      setMovies((prevMovies) => [...prevMovies, ...json.results]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    } catch (error) {
      setError(error);
      console.log("error occurred while fetching: ", error);
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const threshold = 100;
    const scrolledToBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.offsetHeight - threshold;
    if (scrolledToBottom && !loading) {
      fetchMovies();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="bg-[#04152D] text-white min-h-screen">
      <div className="pb-14">
        <Header enableAuthentication={false} />
      </div>
      <div className="container px-4 mx-auto">
        <h1 className="my-8 text-2xl font-bold md:text-3xl">
          Explore Movies From TMDB API
        </h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies?.map((movie) => (
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
        {loading && (
          <div className="flex items-center justify-center my-8">
            <div className="w-12 h-12 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
          </div>
        )}
        {error && <p className="my-8 text-center text-red-500">Error: {error.message}</p>}
      </div>
    </div>
  );
};

export default ExploreMovies;