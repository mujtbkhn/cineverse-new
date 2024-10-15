import { useState, useCallback } from 'react';

const useAddToFavorite = (id, details) => {
    const [favorite, setFavorite] = useState(false);
    const [error, setError] = useState(null);

    // Check the initial favorite status
    const checkFavoriteStatus = useCallback(() => {
        try {
            const favoritesFromStorage = JSON.parse(localStorage.getItem("favorites")) || [];
            const isFavorite = favoritesFromStorage.some((movie) => movie?.id === parseInt(id));
            setFavorite(isFavorite);
        } catch (error) {
            console.error("Error retrieving favorites from localStorage:", error);
            setFavorite(false);
        }
    }, [id]);

    // Add to Favorite function
    const addToFavorite = useCallback(async () => {
        const url = `https://api.themoviedb.org/3/account/${process.env.REACT_APP_ACCOUNT_ID}/favorite`;
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
                favorite: !favorite,  // Toggle favorite status
            }),
        };

        try {
            const res = await fetch(url, options);
            if (!res.ok) {
                throw new Error("Failed to add/remove from favorite");
            }

            const existingFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
            if (favorite) {
                // Remove from favorites
                const updatedFavorites = existingFavorites.filter((movie) => movie?.id !== id);
                localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                setFavorite(false);
            } else {
                // Add to favorites
                const updatedFavorites = [...existingFavorites, details];
                localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                setFavorite(true);
            }
        } catch (err) {
            console.error("Error updating favorites:", err);
            setError("Failed to update favorites");
        }
    }, [id, details, favorite]);

    return { favorite, addToFavorite, error, checkFavoriteStatus };
};

export default useAddToFavorite;
