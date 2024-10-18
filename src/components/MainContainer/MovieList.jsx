import React from "react";
import MovieCard from "../MovieCard";

const MovieList = ({ title, movies }) => {
  return (
    <div className="mx-10 md:mx-20 sm:mx-16">
      <h1 className="flex justify-center py-8 text-4xl mt-20 font-bold text-gray-400 sm:text-6xl md:text-8xl lg:text-9xl xl:text-[160px]
       md:mt-10 font-roboto">{title}</h1>
      <div className="flex overflow-x-scroll md:h-[500px] sm:h-[350px] -mt-5 md:mt-6 scrollbar-hide">
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
