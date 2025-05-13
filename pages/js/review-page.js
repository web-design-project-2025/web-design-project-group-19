import { Movies, getImageUrl } from "./api-tmdb.js";

// Function to fetch and display movie details
async function loadMovieDetails(movieId) {
    try {
        const movie = await Movies.getDetails(movieId);
        document.querySelector(".movie-poster").src = getImageUrl(movie.poster_path);
        document.querySelector(".movie-title").textContent = movie.title;
        document.querySelector(".movie-overview").textContent = movie.overview;
    } catch (error) {
        console.error("Failed to load movie details:", error);
    }
}

// Function to fetch and display reviews
async function loadReviews(movieId) {
    try {
        const reviews = await Movies.getReviews (movieId);
        const reviewList = document.querySelector(".review-list");
        reviewList.innerHTML = ""; 


        if (reviews.results.length === 0) {
            reviewList.innerHTML = "<p>No reviews available for this movie.</p>";
        return;
  }

    reviews.results.forEach((review) => {
        const reviewItem = document.createElement("div");
        reviewItem.classList.add("review-item");

        const author = document.createElement("p");
        author.classList.add("review-author");
        author.textContent = `Author: ${review.author}`;


        const content = document.createElement("p");
        content.classList.add ("review-content");
        content.textContent = review.content;

        reviewItem.appendChild(author);
        reviewItem.appendChild(content);
        reviewList.appendChild(reviewItem);

    });

} catch (error) {
    console.error("Failed to load reviews", error);

}   

}


//Initialize the review page 
function initReviewPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");


if (!movieId) {
    console.error("Movie ID is missing in the URL.");
    return;

}
    
loadMovieDetails(movieId);
loadReviews(movieId);

}

document.addEventListener("DOMContentLoaded", initReviewPage);
    
    
