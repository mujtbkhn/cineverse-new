import React from "react";
import MovieCard from "../MovieCard";

const MovieList = ({ title, movies }) => {
  return (
    <div className="mx-4 md:mx-64">
      <h1 className="flex justify-center py-4 text-6xl text-gray-400 mt-20 md:mt-10  md:text-[200px] font-bold font-roboto">{title}</h1>
      <div className="flex overflow-x-scroll md:h-[500px] -mt-5 md:mt-6 scrollbar-hide">
        <div className="flex">
          {movies &&
            movies.map((movie) => (
              <div key={movie.id} className="flex text-white">
                <MovieCard
                  posterPath={movie.poster_path}
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
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
