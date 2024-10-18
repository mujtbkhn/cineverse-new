import Browse from "./Browse";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import WatchList from "./WatchList";
import Favorite from "./Favorite";
import { Suspense, lazy } from "react";
import ExploreMovies from "./ExploreMovies";
import Login from "./MainContainer/Login";
import { Toaster } from "react-hot-toast";

const MovieDetails = lazy(() => import("./MovieDetails/MovieDetails"));
const Person = lazy(() => import("./Person"));

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Browse />,
    },
    {
      path: "/exploreMovies",
      element: <ExploreMovies />,
    },
    {
      path: "/movieDetails/:movieId",
      element: (
        <Suspense>
          <MovieDetails />
        </Suspense>
      ),
    },
    {
      path: "/person/:personId",
      element: (
        <Suspense>
          <Person />
        </Suspense>
      ),
    },
    {
      path: "/watchlist",
      element: <WatchList />,
    },
    {
      path: "/favorite",
      element: <Favorite />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
      <Toaster position="top-center" />
    </div>
  );
};

export default Body;
