import { Movies, TV } from "./api-tmdb.js";
import { getImageUrl } from "./api-tmdb.js";

// Function to itemize the movies and TV shows 
function renderItems (containerId, items,type = "movie") {
    const container = document.getElementById(containerId);
    container.innerHTML ="";

    items.forEach (item => {
        const img = document.createElement("img");
        img.src = getImageUrl(item.poster_path);
        img.alt = item.title || item.name;
        img.title = item.title || item.name;
        img.classList.add("trending-item");

        img.addEventListener("click", () => {
            window.location.href = `/details.html?type=${type}&id=${item.id}`;
        });

        container.appendChild(img);

    });

}

//Fetch and show trending movies
async function loadTrendingMovies() {
    try {
        const data = await loadTrendingMovies.getPopular();
        renderItems("trending-movies", data.results, "movie");
    } catch (error) {
        console.error("Failed to load trending movies:", error);

    }

}


//Fetch and show trending shows
async function loadTrendingShows() {
    try {
        const data = await TV.getPopular();
        renderItems("trending-shows", data.results, "tv");
    } catch (error) {
        console.error("Failed to load trending shows:", error);

    }
    
}


// Initalize the homepage
function initHomepage() {
    loadTrendingMovies();
    loadTrendingShows();
}

document.addEventListener(DOMContentLoaded, initHomepage);