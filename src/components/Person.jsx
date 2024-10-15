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
    // console.log(json);
    setDetails(json);
    console.log(details.birthday)
  };

  const fetchPersonCredits = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/person/${personId}/movie_credits`,
      OPTIONS
    );
    const json = await data.json();
    console.log(json);
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
    <div className="bg-[#04152D] text-white w-full">
      <div className="flex pt-10 pb-14">
        <Header enableAuthentication={false} />
      </div>
      <div className="items-center w-full align-middle justify-evenly md:flex">
        <div className="flex justify-center m-4 md:w-full md:p-5 md:m-5 md:flex">
          <img
            className="rounded-md "
            src={IMG_CDN + details.profile_path}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-5 p-3 m-3 md:p-5 md:m-5">
          <h1 className="text-3xl italic text-yellow-500 font-semi-bold">{details.name}</h1>
          <p className="md:mr-20 ">{details.biography?.slice(0,1000) + "..."}</p>
          <div className="flex gap-10">
            <p>Birthplace</p>
          <p className="font-bold text-yellow-500">{details.place_of_birth}</p>
          </div>
          <div className="flex gap-10 ">
            <p className="w-16">Age</p>
          <p className="font-bold text-yellow-500">{calculateAge(details.birthday)} Years old</p>
          </div>
          <span className="inline-block px-4 py-2 m-3 text-xl font-semibold text-white bg-transparent border-2 border-white max-w-52 rounded-2xl">Popularity: {details.popularity}</span>
        </div>
      </div>
      <h1 className="flex justify-center p-4 text-2xl font-bold md:text-3xl">
        Movies {details.name} has worked in:{" "}
      </h1>
      <div className="flex flex-wrap justify-center gap-5 p-3">
        {credits.map((movie) => (
          <MovieCard
            className="flex flex-row p-5 m-5"
            key={movie.id}
            posterPath={movie?.poster_path}
            id={movie.id}
            rating={movie.vote_average.toFixed(1)}
            trimmedTitle={
              movie.title.length > 10
                ? movie.title.slice(0, 15) + "..."
                : movie.title
            }
            release_date={movie.release_date}
          />
        ))}
      </div>
    </div>
  );
};

export default Person;
