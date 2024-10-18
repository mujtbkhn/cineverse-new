import React, { useEffect, useRef, useState } from "react";
import { auth } from "../../utils/firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  IMG_CDN_ORG,
  OPTIONS,
  USER_AVATAR,
} from "../../utils/constants";
import useDebounce from "../../hooks/useDebounce";
import MovieCard from "../MovieCard";
import useAuthentication from "../../hooks/useAuthentication";
import useClick from "../../hooks/useClick";

const Header = ({ enableAuthentication = true }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchText = useRef();
  const suggestionsRef = useRef(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (enableAuthentication) {
    useAuthentication();
  }

  useClick(suggestionsRef, () => {
    setSearchTerm("")
    setSuggestions([])
  })

  useEffect(() => {
    const fetchSuggestions = () => {
      if (debouncedSearchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }

      const url = `https://api.themoviedb.org/3/search/multi?query=${debouncedSearchTerm}&include_adult=false&language=en-US&page=1`;
      fetch(url, OPTIONS)
        .then((res) => res.json())
        .then((json) => {
          setSuggestions(json.results);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    fetchSuggestions();
  }, [debouncedSearchTerm]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => { })
      .catch((error) => {
        navigate("/error");
      });
  };

  return (
    <div className="absolute z-50 w-full md:px-24 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-1">
      <div className="flex items-center justify-between">
        <div className="flex gap-5">
          <Link to={"/"}>
            <img
              className="w-24 my-auto md:w-36 md:mx-0"
              src="https://www.cineverse.com/images/cineverse/cineverse.svg?imwidth=256"
              alt="logo"
            />
          </Link>
          <Link className="my-auto" to={"/exploreMovies"}>
            <div className="text-white md:flex mr-2 hidden hover:text-[#f5c518]">
              Movies
            </div>
          </Link>
        </div>
        <div className="text-white w-44 md:w-full">
          <input
            ref={searchText}
            value={searchTerm}
            className="relative flex justify-center md:w-full w-48 md:px-10 py-2 bg-[#1a1a1a] rounded-md active:border-none"
            type="text"
            placeholder="Search Movie or Person"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (

            <ul ref={suggestionsRef} className="absolute z-50 flex flex-wrap justify-center  max-w-screen-xl mx-auto bg-black text-white shadow-lg rounded-lg top-20 left-0 right-0 overflow-y-auto max-h-[80vh] gap-2 pr-10">
              {suggestions.map((result) => {
                if (result.media_type === "movie" && result.poster_path) {
                  return (
                    <li key={result.id} className="w-full p-4 md:w-1/3 lg:w-1/4">
                      <h1 className="mb-2 text-lg font-semibold truncate">{result.title}</h1>
                      <MovieCard
                        posterPath={result.poster_path}
                        id={result.id}
                        className="w-full rounded-md"
                      />
                    </li>
                  );
                } else if (result.media_type === "person" && result.profile_path) {
                  return (
                    <li key={result.id} className="w-full p-4 md:w-1/3 lg:w-1/4">
                      <Link to={`/person/${result.id}`} className="block">
                        <h1 className="mb-2 text-lg font-semibold truncate">{result.name}</h1>
                        <img
                          className="w-full h-auto rounded-md"
                          src={IMG_CDN_ORG + result.profile_path}
                          alt={result.name}
                        />
                      </Link>
                    </li>
                  );
                } else {
                  return null;
                }
              })}
            </ul>
          )}

        </div>

        <Link to={"/watchlist"}>
          <div className="md:flex hidden ml-2 text-white hover:text-[#f5c518]">
            <img
              className="w-7"
              src="https://img.icons8.com/ios-filled/50/737373/bookmark-ribbon.png"
              alt="bookmark-ribbon"
            />{" "}
            Watchlist
          </div>
        </Link>
        <div className="pt-4">
          <span className="items-center group">
            <img
              className="relative items-center h-10 ml-10 rounded-full"
              alt="icon"
              src={USER_AVATAR}
            />

            <div className="absolute flex-col hidden px-8 py-5 bg-gray-300 rounded-md opacity-80 right-10 top-14 group-hover:flex">
              {window.innerWidth > 768 ? (
                <>
                  <button className="px-2 py-2 m-2 text-white bg-red-700 rounded-md md:px-5">
                    <Link to={"/favorite"}> Favorites</Link>
                  </button>
                  {user ? <button
                    className="flex justify-center font-bold text-black"
                    onClick={handleSignOut}
                  >
                    (Sign Out)
                  </button> :
                    <Link to={"/login"} className="flex justify-center font-bold text-black">
                      <button>
                        (Sign In)
                      </button>
                    </Link>}
                </>
              ) : (
                <>
                  <Link to={"/exploreMovies"}>
                    <button className="px-5 py-2 m-2  bg-red-700 rounded-md md:px-5 text-white  hover:text-[#f5c518]">
                      Movies
                    </button>
                  </Link>
                  <Link to={"/watchlist"}>
                    <button className="px-5 py-2 m-2 bg-red-700 rounded-md md:px-5 text-white  hover:text-[#f5c518]">
                      Watchlist
                    </button>
                  </Link>
                  <button className="px-2 py-2 m-2 text-white bg-red-700 rounded-md md:px-5">
                    <Link to={"/favorite"}> Favorites</Link>
                  </button>
                  <button
                    className="flex justify-center font-bold text-black"
                    onClick={handleSignOut}
                  >
                    (Sign Out)
                  </button>
                </>
              )}
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
