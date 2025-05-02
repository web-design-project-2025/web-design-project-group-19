import {
  getPopularMovies,
  getPopularTVShows,
  getPopularActors,
  getImageUrl,
} from "/pages/js/api-tmdb";

const mediaGrid = document.getElementById(".media-grid");
const tabs = document.querySelectorAll(".media-tab");
const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

// Page
let currentPage = 1;
let currentType = "movie"; // Default to movies

// Initialize
loadContent();

// Tab Switching
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentType = tab.dataset.type;
    currentPage = 1;
    loadContent();
  });
});

// Pagination
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadContent();
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  loadContent();
});

// Loading Function
async function loadContent() {
  mediaGrid.innerHTML = '<div class="loading">Loading...</div>';

  try {
    let data;
    switch (currentType) {
      case "tv":
        data = await getPopularTVShows(currentPage);
        break;
      case "person":
        data = await getPopularActors(currentPage);
        break;
      default: // movie
        data = await getPopularMovies(currentPage);
    }

    displayResults(data.results);
    updatePagination(data.total_pages);
  } catch (error) {
    mediaGrid.innerHTML = '<div class="error">Failed to load content</div>';
    console.error(error);
  }
}

// Display Results
function displayResults(items) {
  mediaGrid.innerHTML = items
    .map(
      (item) => `
    <div class="media-card ${currentType}-card">
      <a href="${currentType}detail-.html?id=${item.id}">
        <img src="${getImageUrl(
          currentType === "person" ? item.profile_path : item.poster_path,
          "medium",
          currentType === "person" ? "profile" : "poster"
        )}" 
        onerror="this.src='images/default-${currentType}.jpg'">
        <div class="media-info">
          <h3>${item.title || item.name}</h3>
          <p>${
            (item.release_date || item.first_air_date)?.substring(0, 4) || "N/A"
          }</p>
        </div>
      </a>
    </div>
  `
    )
    .join("");
}

// Pagination "change"
function updatePagination(totalPages) {
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}
