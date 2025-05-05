// TMDB API Configuration

import API_CONFIG from "./api-key";

const TMDB_API = {

// Image size configurations - let's check how much we use the different sizes or if they need to be changed
TMDB_IMAGE_SIZE : {
  poster: {
    small: "/w185",
    medium: "/w342",
    large: "/w780",
  },
  backdrop: {
    medium: "/w780",
    large: "/w1280",
    original: "/original",
  },
  profile: {
    small: "/w45",
    medium: "/w185",
    large: "/h632",
  },
},
}

// Export the configuration
export default TMDB_API;
