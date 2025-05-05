import API_CONFIG from "./api-key";
import TMDB_API from "./config.js";

//function for API requests
async function makeRequest(endpoint, params = {}) {
  try {
    const url = new URL(`${TMDB_API.BASE_URL}${endpoint}`);

    // Add default parameters
    Object.entries({
      ...TMDB_API.DEFAULT_PARAMS,
      api_key: TMDB_API.API_KEY,
      ...params,
    }).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    //Error managing
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`API request failed to ${endpoint}:`, error);
    throw error;
  }
}

// Movie Endpoints
export const Movies = {
  getPopular: (page = 1) => makeRequest("/movie/popular", { page }),
  getTopRated: (page = 1) => makeRequest("/movie/top_rated", { page }),
  getNowPlaying: (page = 1) => makeRequest("/movie/now_playing", { page }),
  getUpcoming: (page = 1) => makeRequest("/movie/upcoming", { page }),
  getDetails: (movieId) => makeRequest(`/movie/${movieId}`),
  getCredits: (movieId) => makeRequest(`/movie/${movieId}/credits`),
  search: (query, page = 1) => makeRequest("/search/movie", { query, page }),
};

// TV Show Endpoints
export const TV = {
  getPopular: (page = 1) => makeRequest("/tv/popular", { page }),
  getTopRated: (page = 1) => makeRequest("/tv/top_rated", { page }),
  getOnAir: (page = 1) => makeRequest("/tv/on_the_air", { page }),
  getDetails: (tvId) => makeRequest(`/tv/${tvId}`),
  getCredits: (tvId) => makeRequest(`/tv/${tvId}/credits`),
  search: (query, page = 1) => makeRequest("/search/tv", { query, page }),
};

// People/Cast Endpoints
export const People = {
  getPopular: (page = 1) => makeRequest("/person/popular", { page }),
  getDetails: (personId) => makeRequest(`/person/${personId}`),
  getMovieCredits: (personId) =>
    makeRequest(`/person/${personId}/movie_credits`),
  getTVCredits: (personId) => makeRequest(`/person/${personId}/tv_credits`),
  getCombinedCredits: (personId) =>
    makeRequest(`/person/${personId}/combined_credits`),
  search: (query, page = 1) => makeRequest("/search/person", { query, page }),
};

// Images
export function getImageUrl(path, size = "medium", type = "poster") {
  if (!path) return null;
  const sizePath = TMDB_API.IMAGE_SIZES[type]?.[size] || "";
  return `${TMDB_API.IMAGE_BASE_URL}${size}${path}`;
}
