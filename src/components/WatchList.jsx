import React, { useEffect, useState } from "react";
import { OPTIONS } from "../utils/constants";
import MovieCard from "./MovieCard";
import Header from "./MainContainer/Header";

const WatchList = () => {
  const [watchList, setWatchList] = useState([]);

  useEffect(() => {
    const loadWatchList = () => {
      try {
        const savedWatchList = localStorage.getItem("WatchList");
        if (savedWatchList) {
          setWatchList(JSON.parse(savedWatchList));
        } else {
          fetchWatchList();
        }
      } catch (error) {
        console.error("Error loading WatchList from localStorage:", error);
        fetchWatchList();
      }
    };

    loadWatchList();
  }, []);

  const fetchWatchList = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account/${process.env.REACT_APP_ACCOUNT_ID}/watchlist/movies?language=en-US&page=1&sort_by=created_at.asc`,
        OPTIONS
      );
      const json = await response.json();
      setWatchList(json.results);
      localStorage.setItem("WatchList", JSON.stringify(json.results));
    } catch (error) {
      console.error("Error fetching or saving WatchList:", error);
    }
  };

  const removeFromWatchList = (id) => {
    const updatedWatchList = watchList.filter((item) => item?.id !== id);
    setWatchList(updatedWatchList);
    try {
      localStorage.setItem("WatchList", JSON.stringify(updatedWatchList));
    } catch (error) {
      console.error("Error updating WatchList in localStorage:", error);
    }
  };

  return (
    <div className="bg-[#04152D] text-white min-h-screen">
      <div className="pb-14">
        <Header enableAuthentication={false} />
      </div>
      <div className="container px-4 mx-auto">
        <h1 className="my-8 text-2xl font-bold text-center md:text-3xl">Your Watch List</h1>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {watchList.map((movie) => (
            <div key={movie?.id} className="flex flex-col items-center">
              <MovieCard
                posterPath={movie?.poster_path}
                id={movie?.id}
                rating={movie?.vote_average.toFixed(1)}
                trimmedTitle={movie?.title.length > 15 ? movie?.title.slice(0, 15) + "..." : movie?.title}
                release_date={movie?.release_date}
              />
              <button
                className="px-4 py-2 mt-2 text-white transition-colors bg-red-700 rounded-md hover:bg-red-600"
                onClick={() => removeFromWatchList(movie?.id)}
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

export default WatchList;