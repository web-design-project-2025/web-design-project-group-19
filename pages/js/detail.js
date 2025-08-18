import { Movies, TV, People, getImageUrl } from "./api-tmdb.js";

// DOM Elements
const elements = {
  container: document.getElementById("detail-container"),
  loading: document.getElementById("loading"),
  poster: document.getElementById("media-poster"),
  title: document.getElementById("media-title"),
  meta: document.getElementById("media-meta"),
  genres: document.getElementById("media-genres"),
  overview: document.getElementById("media-overview"),
  castGrid: document.getElementById("cast-grid"),
};

// URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const params = {
  id: urlParams.get("id"),
  type: urlParams.get("type"),
};

// Initialize when DOM loads
document.addEventListener("DOMContentLoaded", initPage);

async function initPage() {
  if (!params.id || !params.type) {
    showError("Invalid URL parameters. Please go back and try again.");
    return;
  }

  try {
    const [details, credits] = await fetchData();
    renderPage(details, credits);
  } catch (error) {
    console.error("Error loading details:", error);
    showError("Failed to load details. Please try again later.");
  }
}

async function fetchData() {
  switch (params.type) {
    case "movie":
      return Promise.all([
        Movies.getDetails(params.id),
        Movies.getCredits(params.id),
      ]);
    case "tv":
      return Promise.all([TV.getDetails(params.id), TV.getCredits(params.id)]);
    case "person":
      return Promise.all([
        People.getDetails(params.id),
        People.getCombinedCredits(params.id),
      ]);
    default:
      throw new Error("Invalid media type");
  }
}

function renderPage(details, credits) {
  elements.loading.classList.add("hidden");

  // Set common elements
  setMainContent(details);

  // Set type-specific content
  if (params.type === "person") {
    renderPersonDetails(details, credits);
  } else {
    renderMediaDetails(details, credits);
  }

  elements.container.classList.remove("hidden");
}

function setMainContent(details) {
  // Set poster image
  const imageType = params.type === "person" ? "profile" : "poster";
  const imagePath =
    params.type === "person" ? details.profile_path : details.poster_path;
  elements.poster.src = getImageUrl(imagePath, "medium", imageType);
  elements.poster.alt = details.title || details.name;

  // Set title
  elements.title.textContent = details.title || details.name;

  // Set info
  elements.meta.textContent = generateMetaText(details);

  // Set genres
  elements.genres.innerHTML = generateGenresHTML(details);

  // Set overview/biography
  elements.overview.textContent =
    details.overview || details.biography || "No information available.";
}

function generateMetaText(details) {
  switch (params.type) {
    case "movie":
      return [
        details.release_date?.substring(0, 4),
        details.runtime && formatRuntime(details.runtime),
        details.vote_average && `⭐ ${details.vote_average.toFixed(1)}/10`,
      ]
        .filter(Boolean)
        .join(" • ");

    case "tv":
      return [
        details.first_air_date?.substring(0, 4),
        details.episode_run_time?.[0] &&
          `${details.episode_run_time[0]} min/episode`,
        details.vote_average && `⭐ ${details.vote_average.toFixed(1)}/10`,
      ]
        .filter(Boolean)
        .join(" • ");

    case "person":
      return [
        details.birthday && `Born: ${formatDate(details.birthday)}`,
        details.place_of_birth && `in ${details.place_of_birth}`,
        details.deathday && `Died: ${formatDate(details.deathday)}`,
      ]
        .filter(Boolean)
        .join(" ");
  }
}

function generateGenresHTML(details) {
  if (params.type === "person") {
    return details.known_for_department
      ? `<span class="genre-tag">${details.known_for_department}</span>`
      : "";
  }
  return (
    details.genres
      ?.map((genre) => `<span class="genre-tag">${genre.name}</span>`)
      .join("") || ""
  );
}

function renderMediaDetails(details, credits) {
  if (credits?.cast?.length > 0) {
    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "section-title";
    sectionTitle.textContent = "Cast";
    elements.container.appendChild(sectionTitle);

    elements.castGrid.innerHTML = credits.cast
      .map(
        (person) => `
            <div class="cast-card">
                <img src="${getImageUrl(
                  person.profile_path,
                  "medium",
                  "profile"
                )}" 
                     alt="${person.name}" 
                     onerror="this.src='/web-design-project-group-19/pages/assets/noimage.png'"
                <div class="cast-info">
                    <p class="cast-name">${person.name}</p>
                    <p class="cast-character">${person.character || "N/A"}</p>
                </div>
            </div>
        `
      )
      .join("");
  } else {
    elements.castGrid.innerHTML =
      '<p class="no-cast">No cast information available</p>';
  }
}

function renderPersonDetails(details, credits) {
  if (credits?.cast?.length > 0) {
    const knownFor = credits.cast
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 21);

    if (knownFor.length > 0) {
      const sectionTitle = document.createElement("h2");
      sectionTitle.className = "section-title";
      sectionTitle.textContent = "Known For";
      elements.container.appendChild(sectionTitle);

      const knownForGrid = document.createElement("div");
      knownForGrid.className = "known-for-grid";

      knownForGrid.innerHTML = knownFor
        .map((item) => {
          const title = item.title || item.name;
          return `
                    <div class="known-for-item">
                        <img src="${getImageUrl(
                          item.poster_path,
                          "medium",
                          "poster"
                        )}" 
                             alt="${title}"
                             onerror="this.src='to-fix'">
                        <p class="known-for-title">${title}</p>
                        <p class="known-for-character">${
                          item.character || ""
                        }</p>
                    </div>
                `;
        })
        .join("");

      elements.container.appendChild(knownForGrid);
    }
  }
}

// Utility functions
function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function showError(message) {
  elements.loading.classList.add("hidden");
  elements.container.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <a href="/web-design-project-group-19/index.html" class="back-button">← Back to Search</a>
        </div>
    `;
  elements.container.classList.remove("hidden");
}
