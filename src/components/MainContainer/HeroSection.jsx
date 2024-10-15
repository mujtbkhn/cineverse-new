import React, { useEffect, useState } from "react";
import { IMG_CDN_ORG, OPTIONS } from "../../utils/constants";

const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1`,
        OPTIONS
      );
      const json = await data.json();
      const randomIndex = Math.floor(Math.random() * 20)
      const randomMovie = json?.results?.[randomIndex]
      setMovies(randomMovie);
    } catch (error) {
      console.log("error occurred while fetching: ", error);
    }
  };
  return (
    <>
      <div className="md:w-screen md:h-screen text-white bg-[#04152D] ">
        <img className="w-screen  opacity-60 object-cover h-96 md:h-[700px]" src={IMG_CDN_ORG + movies.backdrop_path} alt="" />
      </div>
    </>
  );
};

export default HeroSection;
