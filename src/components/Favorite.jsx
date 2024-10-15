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
    <div className="bg-[#04152D] text-white">
      <div className="flex pb-14">
        <Header enableAuthentication={false} />
      </div>
      <div className="flex flex-wrap justify-center gap-10 p-10">
        {favorite.map((movie) => (
          <div className="flex flex-col" key={movie.id}>
            <MovieCard
              className="flex flex-wrap justify-center gap-10 p-1 m-2 md:p-5 md:m-5"
              posterPath={movie?.poster_path}
              id={movie.id}
              rating={movie.vote_average.toFixed(1)}
              trimmedTitle={
                window.innerWidth < 768
                  ? movie.title.length > 5
                    ? movie.title.slice(0, 6) + "..."
                    : movie.title
                  : movie.title.length > 10
                    ? movie.title.slice(0, 15) + "..."
                    : movie.title
              }
              release_date={movie.release_date}
              onFavoriteClick={() => handleFavoriteClick(movie)}
            />
            <div className="flex justify-center">
              <button
                className="px-5 pt-2 bg-red-700 rounded-md"
                onClick={() => removeFromFavorite(movie.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorite;
