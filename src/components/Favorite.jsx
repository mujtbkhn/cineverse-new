import React, { useEffect, useState } from "react";
import { OPTIONS } from "../utils/constants";
import MovieCard from "./MovieCard";
import Header from "./MainContainer/Header";
import useAddToFavorite from "../hooks/useAddToFavorites";

const Favorite = () => {
  const [favorite, setFavorite] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const loadFavorite = () => {
      try {
        const savedFavorite = localStorage.getItem("favorites");
        if (savedFavorite) {
          setFavorite(JSON.parse(savedFavorite));
        }
      } catch (error) {
        console.error("Error loading Favorite from localStorage:", error);
      }
    };

    loadFavorite();
  }, []);

  const { addToFavorite, checkFavoriteStatus } = useAddToFavorite(selectedMovie?.id, selectedMovie);

  const removeFromFavorite = (id) => {
    const updatedFavorite = favorite.filter((item) => item?.id !== id);
    setFavorite(updatedFavorite);
    try {
      localStorage.setItem("favorites", JSON.stringify(updatedFavorite));
    } catch (error) {
      console.error("Error updating Favorite in localStorage:", error);
    }
  };

  const handleFavoriteClick = (movie) => {
    setSelectedMovie(movie);
    checkFavoriteStatus();
  };

  return (
    <div className="bg-[#04152D] text-white min-h-screen">
      <div className="pb-14">
        <Header enableAuthentication={false} />
      </div>
      <div className="container px-4 mx-auto">
        <h1 className="my-8 text-2xl font-bold text-center md:text-3xl">Your Favorites</h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {favorite.map((movie) => (
            <div className="flex flex-col items-center" key={movie.id}>
              <MovieCard
                posterPath={movie?.poster_path}
                id={movie.id}
                rating={movie.vote_average.toFixed(1)}
                trimmedTitle={movie.title.length > 15 ? movie.title.slice(0, 15) + "..." : movie.title}
                release_date={movie.release_date}
                onFavoriteClick={() => handleFavoriteClick(movie)}
              />
              <button
                className="px-4 py-2 mt-2 text-white transition-colors bg-red-700 rounded-md hover:bg-red-600"
                onClick={() => removeFromFavorite(movie.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorite;