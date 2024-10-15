import { useState, useCallback } from 'react';

const useAddToWatchlist = (id, details) => {
  const [watchList, setWatchList] = useState(false);
  const [error, setError] = useState(null);

  // Check the initial watchlist status
  const checkWatchListStatus = useCallback(() => {
    try {
      const watchlistFromStorage = JSON.parse(localStorage.getItem("WatchList")) || [];
      const isWatchList = watchlistFromStorage.some((movie) => movie?.id === parseInt(id));
      setWatchList(isWatchList);
    } catch (error) {
      console.error("Error retrieving watchlist from localStorage:", error);
      setWatchList(false);
    }
  }, [id]);

  // Add to Watchlist function
  const addToWatchList = useCallback(async () => {
    const url = `https://api.themoviedb.org/3/account/${process.env.REACT_APP_ACCOUNT_ID}/watchlist`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: "Bearer " + process.env.REACT_APP_TMDB_KEY,
      },
      body: JSON.stringify({
        media_type: "movie",
        media_id: id,
        watchlist: !watchList,  // Toggle watchlist status
      }),
    };

    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error("Failed to update watchlist");
      }

      const existingWatchLists = JSON.parse(localStorage.getItem("WatchList")) || [];
      if (watchList) {
        // Remove from watchlist
        const updatedWatchLists = existingWatchLists.filter((movie) => movie?.id !== id);
        localStorage.setItem("WatchList", JSON.stringify(updatedWatchLists));
        setWatchList(false);
      } else {
        // Add to watchlist
        const updatedWatchLists = [...existingWatchLists, details];
        localStorage.setItem("WatchList", JSON.stringify(updatedWatchLists));
        setWatchList(true);
      }
    } catch (err) {
      console.error("Error updating watchlist:", err);
      setError("Failed to update watchlist");
    }
  }, [id, details, watchList]);

  return { watchList, addToWatchList, error, checkWatchListStatus };
};

export default useAddToWatchlist;
