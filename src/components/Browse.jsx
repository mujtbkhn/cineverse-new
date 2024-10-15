import React from "react";
import Header from "./MainContainer/Header";
import useNowPlayingMovies from "../hooks/useNowPlaying";
import MainContainer from "./MainContainer/MainContainer";
import SecondaryContainer from "./MainContainer/SecondaryContainer";
import usePopularMovies from "../hooks/usePopularMovies";
import useTopRatedMovies from "../hooks/useTopRatedMovies";
import useUpcomingMovies from "../hooks/useUpcomingMovies";

// import { useSelector } from "react-redux";
import Footer from "./MainContainer/Footer";
// import GPTSearch from "./GPT/GPTSearch";

const Browse = () => {
  //these are called to update the store so whenever i fetch from SecondaryContainer i get the updated movies lists
  useNowPlayingMovies();
  usePopularMovies();
  useTopRatedMovies();
  useUpcomingMovies();

  // const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  return (
    <div className="overflow-y-scroll scrollbar-hide">
      <Header />
      {/* {showGptSearch ? (
        <GPTSearch />

      ) : ( */}
        {/* <> */}
          {" "}
          <MainContainer />
          <SecondaryContainer />{" "}
        {/* </>
      )} */}
      <Footer />
    </div>
  );
};

export default Browse;
