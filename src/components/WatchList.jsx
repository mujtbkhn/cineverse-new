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
    <div className="bg-[#04152D] text-white pt-5">
      <div className="flex pb-14">
        <Header enableAuthentication={false} />
      </div>

      <div className="flex flex-wrap justify-center gap-10 p-10">
        {watchList.map((movie) => (
          <div key={movie?.id}>
            <MovieCard
              className="flex flex-wrap justify-center gap-10 p-1 m-2 md:p-5 md:m-5"
              posterPath={movie?.poster_path}
              id={movie?.id}
              rating={movie?.vote_average.toFixed(1)}
              trimmedTitle={
                window.innerWidth < 768
                  ? movie?.title.length > 5
                    ? movie?.title.slice(0, 6) + "..."
                    : movie?.title
                  : movie?.title.length > 10
                  ? movie?.title.slice(0, 15) + "..."
                  : movie?.title
              }
              release_date={movie?.release_date}
            />
            <button
              className="px-5 pt-2 bg-red-700 rounded-md "
              onClick={() => removeFromWatchList(movie?.id)}
            >
              watched?
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchList;