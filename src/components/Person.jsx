import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IMG_CDN, OPTIONS } from "../utils/constants";
import MovieCard from "./MovieCard";
import Header from "./MainContainer/Header";

const Person = () => {
  const [details, setDetails] = useState([]);
  const [credits, setCredits] = useState([]);
  const { personId } = useParams();

  useEffect(() => {
    fetchPersonDetails();
    fetchPersonCredits();
  }, [personId]);

  const fetchPersonDetails = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/person/${personId}`,
      OPTIONS
    );
    const json = await data.json();
    setDetails(json);
  };

  const fetchPersonCredits = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/person/${personId}/movie_credits`,
      OPTIONS
    );
    const json = await data.json();
    setCredits(json.cast);
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-[#04152D] text-white w-full min-h-screen">
      <div className="pt-10 pb-14">
        <Header enableAuthentication={false} />
      </div>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center space-y-8 md:flex-row md:items-start md:space-y-0 md:space-x-8">
          <div className="flex justify-center w-full md:w-1/3">
            <img
              className="w-64 max-w-sm rounded-lg shadow-lg md:w-full"
              src={IMG_CDN + details.profile_path}
              alt={details.name}
            />
          </div>
          <div className="w-full space-y-6 md:w-2/3">
            <h1 className="text-3xl italic font-semibold text-center text-yellow-500 md:text-4xl md:text-left">{details.name}</h1>
            <p className="text-sm md:text-base">{details.biography?.slice(0,1000) + "..."}</p>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="font-medium">Birthplace:</p>
                <p className="font-bold text-yellow-500">{details.place_of_birth}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Age:</p>
                <p className="font-bold text-yellow-500">{calculateAge(details.birthday)} Years old</p>
              </div>
            </div>
            <div className="flex justify-center md:justify-start">
              <span className="inline-block px-4 py-2 text-lg font-semibold text-white bg-transparent border-2 border-white rounded-full">
                Popularity: {details.popularity?.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <h2 className="my-8 text-2xl font-bold text-center md:text-3xl">
          Movies {details.name} has worked in:
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {credits.map((movie) => (
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
      </div>
    </div>
  );
};

export default Person;