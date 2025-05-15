import { Movies, TV, getImageUrl } from "./api-tmdb.js";

// Function to itemize the movies and TV shows
function renderItems(containerId, items, type = "movie") {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  items.forEach((item) => {
    const img = document.createElement("img");
    img.src = getImageUrl(item.poster_path);
    img.alt = item.title || item.name;
    img.title = item.title || item.name;
    img.classList.add("trending-item");

    img.addEventListener("click", () => {
      window.location.href = `/pages/html/detail-page.html?type=${type}&id=${item.id}`;
    });

    container.appendChild(img);
  });
}

//Fetch and show trending movies
async function loadTrendingMovies() {
  try {
    const data = await Movies.getPopular();
    console.log("Trending Movies Data:", data);
    renderItems("trending-movies", data.results, "movie");
  } catch (error) {
    console.error("Failed to load trending movies:", error);
  }
}

//Fetch and show trending shows
async function loadTrendingShows() {
  try {
    const data = await TV.getPopular();
    console.log("Trending Shows Data:", data);
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

document.addEventListener("DOMContentLoaded", initHomepage);

//Add scrolling effect
function setupScrollButtons(sectionId) {
  const container = document.getElementById(sectionId);
  const leftButton = container.parentElement.querySelector(
    '.arrow[aria-label="Scroll Left"]'
  );
  const rightButton = container.parentElement.querySelector(
    '.arrow[aria-label="Scroll Right"]'
  );

  //Scroll left
  leftButton.addEventListener("click", () => {
    container.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  });

  //Scroll right
  rightButton.addEventListener("click", () => {
    container.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  });
}

//Initialize scrolling Trending Movies and Shows
document.addEventListener("DOMContentLoaded", () => {
  setupScrollButtons("trending-movies");
  setupScrollButtons("trending-shows");
});
