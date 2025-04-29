let currentPage = 1;
const moviesPerPage = 5;

async function loadPage(page) {
  try {
    const data = await fetchMovies({
      page: page,
      limit: moviesPerPage,
    });

    displayMovies(data.results);

    // Update pagination controls
    document.getElementById("current-page").textContent = page;
    document.getElementById("total-pages").textContent = data.total_pages;
  } catch (error) {
    console.error("Error loading page:", error);
  }
}

// Pagination controls event listeners
document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadPage(currentPage);
  }
});

document.getElementById("next-page").addEventListener("click", () => {
  currentPage++;
  loadPage(currentPage);
});

// Initial load
loadPage(currentPage);
