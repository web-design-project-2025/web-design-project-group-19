import { Movies, getImageUrl } from "./api-tmdb.js";

// Function to display movie details
async function loadMovieDetails(movieId) {
    try {
        const movie = await Movies.getDetails(movieId);
        document.querySelector(".movie-poster").src = getImageUrl(movie.poster_path);
        document.querySelector("movie-title").textContent = movie.title;
        document.querySelector("movie-overview").textContent = movie.overview;
    } catch (error) {
        consoler.error("Failed to load movie details:", error);
    }
}

