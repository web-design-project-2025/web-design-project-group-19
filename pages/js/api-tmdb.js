import TMDB_API from "pages/js/config.js";

export async function searchMovies(query) {
  const response = await fetch(
    `${TMDB_API.BASE_URL}/search/movie?api_key=${TMDB_API.API_KEY}&query=${query}`
  );
  return await response.json();
}

export async function searchActors(query) {
  // Similar for actors
}

// taken from web - need to test
