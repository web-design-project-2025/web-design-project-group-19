import { Movies, TV, People, Genres, getImageUrl } from "./api-tmdb.js";

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchTypeRadios = document.getElementsByName("search-type");
const resultsContainer = document.getElementById("results-container");
const resultsTitle = document.getElementById("results-title");
const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const genreDropdown = document.getElementById("genre-dropdown");

// State
let currentPage = 1;
let currentSearchType = "movie";
let currentQuery = "";
let currentGenre = null;
let totalPages = 1;
let genresList = [];

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  await loadGenres();
  loadPopularMovies();
  setupEventListeners();
});

// Load all available genres
async function loadGenres() {
  try {
    const movieGenres = await Genres.getMovieList();
    const tvGenres = await Genres.getTVList();

    genresList = [
      ...movieGenres.genres,
      ...tvGenres.genres.filter(
        (tvGenre) =>
          !movieGenres.genres.some((movieGenre) => movieGenre.id === tvGenre.id)
      ),
    ];

    // Populate genre dropdown
    genreDropdown.innerHTML = '<option value="">All Genres</option>';
    genresList.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      genreDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading genres:", error);
  }
}

function setupEventListeners() {
  // Search functionality
  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch();
  });

  // Pagination
  prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateResults();
    }
  });

  nextPageButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateResults();
    }
  });

  // Search type change
  searchTypeRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      currentSearchType = e.target.value;
      currentPage = 1;
      currentGenre = null; // Reset genre filter when changing type
      genreDropdown.value = "";
      if (currentQuery) {
        performSearch();
      } else {
        loadDefaultContent();
      }
    });
  });

  // Genre filter change
  genreDropdown.addEventListener("change", (e) => {
    currentGenre = e.target.value ? parseInt(e.target.value) : null;
    currentPage = 1;
    updateResults();
  });
}

async function performSearch() {
  currentQuery = searchInput.value.trim();
  currentGenre = null; // Reset genre filter when performing a new search
  genreDropdown.value = "";

  if (!currentQuery) {
    loadDefaultContent();
    return;
  }

  currentPage = 1;
  updateResults();
}

async function updateResults() {
  try {
    let response;
    if (currentQuery) {
      // Perform search (genre filter doesn't apply to search)
      switch (currentSearchType) {
        case "movie":
          response = await Movies.search(currentQuery, currentPage);
          resultsTitle.textContent = `Movie Results for "${currentQuery}"`;
          break;
        case "tv":
          response = await TV.search(currentQuery, currentPage);
          resultsTitle.textContent = `TV Show Results for "${currentQuery}"`;
          break;
        case "person":
          response = await People.search(currentQuery, currentPage);
          resultsTitle.textContent = `People Results for "${currentQuery}"`;
          break;
      }
    } else {
      // Load content with optional genre filter
      if (currentGenre) {
        // Use genre-specific content
        switch (currentSearchType) {
          case "movie":
            response = await Genres.getMoviesByGenre(currentGenre, currentPage);
            const movieGenreName =
              genresList.find((g) => g.id === currentGenre)?.name || "Selected";
            resultsTitle.textContent = `${movieGenreName} Movies`;
            break;
          case "tv":
            response = await Genres.getTVByGenre(currentGenre, currentPage);
            const tvGenreName =
              genresList.find((g) => g.id === currentGenre)?.name || "Selected";
            resultsTitle.textContent = `${tvGenreName} TV Shows`;
            break;
          case "person":
            // Genre filter doesn't apply to people
            response = await People.getPopular(currentPage);
            resultsTitle.textContent = "Popular People";
            break;
        }
      } else {
        // Load popular content without genre filter
        switch (currentSearchType) {
          case "movie":
            response = await Movies.getPopular(currentPage);
            resultsTitle.textContent = "Popular Movies";
            break;
          case "tv":
            response = await TV.getPopular(currentPage);
            resultsTitle.textContent = "Popular TV Shows";
            break;
          case "person":
            response = await People.getPopular(currentPage);
            resultsTitle.textContent = "Popular People";
            break;
        }
      }
    }

    totalPages = response.total_pages;
    updatePagination();
    displayResults(response.results);
  } catch (error) {
    console.error("Error fetching results:", error);
    resultsContainer.innerHTML =
      "<p>Error loading results. Please try again.</p>";
  }
}

function loadDefaultContent() {
  currentQuery = "";
  currentPage = 1;
  updateResults();
}

function loadPopularMovies() {
  currentSearchType = "movie";
  loadDefaultContent();
}

function updatePagination() {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageButton.disabled = currentPage <= 1;
  nextPageButton.disabled = currentPage >= totalPages;
}

function displayResults(results) {
  resultsContainer.innerHTML = "";

  if (!results || results.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }

  results.forEach((item) => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.addEventListener("click", () => {
      // Navigate to detail page with item ID and type
      window.location.href = `detail-page.html?id=${item.id}&type=${currentSearchType}`;
    });

    let title, posterPath, metaInfo;

    if (currentSearchType === "movie") {
      title = item.title;
      posterPath = item.poster_path;
      metaInfo = item.release_date ? item.release_date.substring(0, 4) : "N/A";
      // Add genre names if available
      if (item.genre_ids && item.genre_ids.length > 0) {
        const genreNames = item.genre_ids
          .map((id) => genresList.find((g) => g.id === id)?.name)
          .filter(Boolean)
          .join(", ");
        if (genreNames) {
          metaInfo += ` • ${genreNames}`;
        }
      }
    } else if (currentSearchType === "tv") {
      title = item.name;
      posterPath = item.poster_path;
      metaInfo = item.first_air_date
        ? item.first_air_date.substring(0, 4)
        : "N/A";
      // Add genre names if available
      if (item.genre_ids && item.genre_ids.length > 0) {
        const genreNames = item.genre_ids
          .map((id) => genresList.find((g) => g.id === id)?.name)
          .filter(Boolean)
          .join(", ");
        if (genreNames) {
          metaInfo += ` • ${genreNames}`;
        }
      }
    } else if (currentSearchType === "person") {
      title = item.name;
      posterPath = item.profile_path;
      metaInfo = item.known_for_department || "N/A";
      // For people, show what they're known for
      if (item.known_for && item.known_for.length > 0) {
        const knownFor = item.known_for
          .map((work) => work.title || work.name)
          .filter(Boolean)
          .join(", ");
        if (knownFor) {
          metaInfo += ` • Known for: ${knownFor}`;
        }
      }
    }

    const posterUrl = posterPath
      ? getImageUrl(
          posterPath,
          "medium",
          currentSearchType === "person" ? "profile" : "poster"
        )
      : currentSearchType === "person"
      ? "/web-design-project-group-19/pages/assets/noimage.png"
      : "/web-design-project-group-19/pages/assets/nomedia.png";
    // The nomedia.png was generated with Sora by OpenAI on 18:08:2025 - Prompt: create a simple image with a cream neutral background and a carmine red movie icon

    card.innerHTML = `
      <img src="${posterUrl}" alt="${title}" class="result-poster">
      <div class="result-info">
        <h3 class="result-title">${title}</h3>
        <p class="result-meta">${metaInfo}</p>
      </div>
    `;

    resultsContainer.appendChild(card);
  });
}
