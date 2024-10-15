import React, { useEffect, useState } from "react";
import { IMG_CDN, OPTIONS } from "../utils/constants";
import { Link } from "react-router-dom";
import Rating from "./MainContainer/rating";
import useAddToWatchlist from "../hooks/useAddToWatchlist";
import useAddToFavorite from "../hooks/useAddToFavorites";

const MovieCard = ({ id, posterPath, rating, trimmedTitle, release_date }) => {
  const [details, setDetails] = useState(null);

  const { watchList, addToWatchList, checkWatchListStatus } = useAddToWatchlist(id, details);
  const { favorite, addToFavorite, checkFavoriteStatus } = useAddToFavorite(id, details);

  useEffect(() => {
    fetchDetails();
    checkFavoriteStatus();
    checkWatchListStatus();
  }, [id, checkWatchListStatus, checkFavoriteStatus]);

  const fetchDetails = async () => {
    const data = await fetch(`https://api.themoviedb.org/3/movie/${id}`, OPTIONS);
    const json = await data.json();
    setDetails(json);
  };

  if (!posterPath) return null;

  return (
    <div className="relative z-10 w-32 pr-6 rounded-md md:w-60">
      <div className="">
        <div
          onClick={addToWatchList}
          className="flex justify-around mx-auto text-4xl md:justify-center w-96"
        >
          {watchList ? (
            <img
              className="absolute left-0 z-20 opacity-80"
              src="https://img.icons8.com/fluency/48/bookmark-ribbon.png"
              alt="bookmark icon"
            />
          ) : (
            <img
              className="absolute left-0 z-20 opacity-80"
              src="https://img.icons8.com/fluency/48/add-bookmark.png"
              alt="add-bookmark"
            />
          )}
        </div>
        <div
          onClick={addToFavorite}
          className="flex justify-around mx-auto text-4xl md:justify-center w-96"
        >
          {favorite ? (
            <img
              className="absolute z-20 right-7 opacity-80"
              src="https://img.icons8.com/ios-filled/40/FF0000/like--v1.png"
              alt="favorite icon"
            />
          ) : (
            <img
              className="absolute z-20 right-7 opacity-80"
              src="https://img.icons8.com/ios/40/FF0000/like--v1.png"
              alt="add-favorite"
            />
          )}
        </div>
      </div>
      <Link to={`/movieDetails/${id}`}>
        <img
          alt="movie card"
          className="relative rounded-md"
          src={IMG_CDN + posterPath}
        />
      </Link>
      <h2 className="mt-1 text-xl">{trimmedTitle}</h2>
      <div className="flex justify-between mt-2">
        <div className="flex">
          <img
            className="object-contain w-6"
            src="https://img.icons8.com/fluency/48/star--v1.png"
            alt="star icon"
          />
          <h2 className="text-xl">{rating}</h2>
        </div>
        <span className="group">
          <img
            className="w-7"
            src="https://img.icons8.com/ios/50/737373/star--v1.png"
            alt="star icon"
          />
          <div className="absolute hidden left-10 group-hover:flex bottom-12">
            <Rating />
          </div>
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
