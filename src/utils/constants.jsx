import IMG from "../../images/cineverse.png";
import SEARCH from "../../images/search.svg";
import dots from "../../images/three_dots.svg";
import addToFav from "../../images/add_to_favorites.svg";
import Favorite from "../../images/favorites.svg";
import addBookmark from "../../images/bookmark_saved.svg";
import removeBookmark from "../../images/bookmark_minus.svg";

export const LOGO = IMG;
export const search_img = SEARCH;
export const three_dots = dots;

export const addFav = addToFav;
export const favo = Favorite;
export const addInToWatchList = addBookmark;
export const removeFromWatchList = removeBookmark;

export const BACKGROUND =
  "https://assets.nflxext.com/ffe/siteui/vlv3/c38a2d52-138e-48a3-ab68-36787ece46b3/eeb03fc9-99c6-438e-824d-32917ce55783/IN-en-20240101-popsignuptwoweeks-perspective_alpha_website_medium.jpg";

export const USER_AVATAR = "https://api.multiavatar.com/stefan.svg";

export const OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + process.env.REACT_APP_TMDB_KEY,
  },
};

export const IMG_CDN = "https://image.tmdb.org/t/p/w300";
export const IMG_CDN_ORG = "https://image.tmdb.org/t/p/original";

export const SUPPORTED_LANGUAGES = [
  { identifier: "en", name: "English" },
  { identifier: "hindi", name: "Hindi" },
  { identifier: "arabic", name: "Arabic" },
];

export const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;
