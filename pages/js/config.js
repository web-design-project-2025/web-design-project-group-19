// TMDB API Configuration

const TMDB_API = {
  API_KEY: "c51cb819cd10ae0f7e2df747f3d899e2",

  // Base URL for all API requests
  BASE_URL: "https://api.themoviedb.org/3",

  // Base URL for movie images
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",

  // Default parameters for API requests
  DEFAULT_PARAMS: {
    language: "en-US",
    page: 1,
    region: "US",
  },
};

// Image size configurations - let's check how much we use the different sizes or if they need to be changed
TMDB_API.IMAGE_SIZES = {
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
};

// Export the configuration
export default TMDB_API;
