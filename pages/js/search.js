import { Movies, TV, People, getImageUrl } from './api-tmdb.js';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchTypeRadios = document.getElementsByName('search-type');
const resultsContainer = document.getElementById('results-container');
const resultsTitle = document.getElementById('results-title');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// State
let currentPage = 1;
let currentSearchType = 'movie';
let currentQuery = '';
let totalPages = 1;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPopularMovies();
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Pagination
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateResults();
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateResults();
        }
    });

    // Search type change
    searchTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentSearchType = e.target.value;
            currentPage = 1;
            if (currentQuery) {
                performSearch();
            } else {
                loadDefaultContent();
            }
        });
    });
}

async function performSearch() {
    currentQuery = searchInput.value.trim();
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
            // Perform search
            switch (currentSearchType) {
                case 'movie':
                    response = await Movies.search(currentQuery, currentPage);
                    resultsTitle.textContent = `Movie Results for "${currentQuery}"`;
                    break;
                case 'tv':
                    response = await TV.search(currentQuery, currentPage);
                    resultsTitle.textContent = `TV Show Results for "${currentQuery}"`;
                    break;
                case 'person':
                    response = await People.search(currentQuery, currentPage);
                    resultsTitle.textContent = `People Results for "${currentQuery}"`;
                    break;
            }
        } else {
            // Load popular content
            switch (currentSearchType) {
                case 'movie':
                    response = await Movies.getPopular(currentPage);
                    resultsTitle.textContent = 'Popular Movies';
                    break;
                case 'tv':
                    response = await TV.getPopular(currentPage);
                    resultsTitle.textContent = 'Popular TV Shows';
                    break;
                case 'person':
                    response = await People.getPopular(currentPage);
                    resultsTitle.textContent = 'Popular People';
                    break;
            }
        }

        totalPages = response.total_pages;
        updatePagination();
        displayResults(response.results);
    } catch (error) {
        console.error('Error fetching results:', error);
        resultsContainer.innerHTML = '<p>Error loading results. Please try again.</p>';
    }
}

function loadDefaultContent() {
    currentQuery = '';
    currentPage = 1;
    updateResults();
}

function loadPopularMovies() {
    currentSearchType = 'movie';
    loadDefaultContent();
}

function updatePagination() {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageButton.disabled = currentPage <= 1;
    nextPageButton.disabled = currentPage >= totalPages;
}

function displayResults(results) {
    resultsContainer.innerHTML = '';

    if (!results || results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-card';

        let title, posterPath, metaInfo;

        if (currentSearchType === 'movie') {
            title = item.title;
            posterPath = item.poster_path;
            metaInfo = item.release_date ? item.release_date.substring(0, 4) : 'N/A';
        } else if (currentSearchType === 'tv') {
            title = item.name;
            posterPath = item.poster_path;
            metaInfo = item.first_air_date ? item.first_air_date.substring(0, 4) : 'N/A';
        } else if (currentSearchType === 'person') {
            
            title = item.name;
            posterPath = item.profile_path;
            metaInfo = item.known_for_department || 'N/A';
        }

        const posterUrl = posterPath 
            ? getImageUrl(posterPath, 'medium', currentSearchType === 'person' ? 'profile' : 'poster')
            : 'to fix! ';

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