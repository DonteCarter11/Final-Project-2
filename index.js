// // // API 1: "https://jsonplaceholder.typicode.com/users"
// // // API 2: "https://jsonplaceholder.typicode.com/posts?userId=:id"

// // //Api: https://digimon-api.vercel.app/api/digimon

const userListEl = document.querySelector(".user__list");
const searchInput = document.getElementById("search");
const levelSlider = document.getElementById("level__filter");
const currentLevelLabel = document.getElementById("selectedLevel");
const searchForm = document.getElementById("search__form");
const searchTerm = document.querySelector(".search__term");
const loadingSpinner = document.querySelector(".cards__loading");
const searchIcon = document.getElementById("search__btn");

let allDigimon = [];
let uniqueLevels = ["All"];
let selectedLevel = "All";
let searchQuery = "";
let cards;

async function main() {
  const res = await fetch("https://digimon-api.vercel.app/api/digimon");
  const data = await res.json();
  allDigimon = data;

  // Get unique levels and update slider
  const levelsFromData = [...new Set(data.map((d) => d.level))];
  uniqueLevels = ["All", ...levelsFromData];
  levelSlider.max = uniqueLevels.length - 1;
  updateSliderLabel(0);
  renderList(allDigimon);
}

function updateSliderLabel(index) {
  selectedLevel = uniqueLevels[index];
  currentLevelLabel.textContent = selectedLevel;
  applyFilters();
}

function renderList(list) {
const noResultsEl = document.getElementById("no__results")

  if (list.length === 0) {
    userListEl.innerHTML = "";
    if(noResultsEl) noResultsEl.style.display = "block";
  } else {
    if(noResultsEl) noResultsEl.style.display = "none";
    userListEl.innerHTML = list
      .map(
        (user) => `
        <div class="user-card">
          <h3>${user.name}</h3>
          <img src="${user.img}" alt="${user.name}" />
          <p>Level: ${user.level}</p>
        </div>
      `
      )
      .join("");
  }
}

function applyFilters() {
  loadingSpinner.style.display = "block";
  userListEl.style.display = "none";

  setTimeout(() => {
    const query = searchInput.value.toLowerCase();
    const filtered = allDigimon.filter((d) => {
      const matchName = d.name.toLowerCase().includes(query);
      const matchLevel = selectedLevel === "All" || d.level === selectedLevel;
      return matchName && matchLevel;
    });
    renderList(filtered);

    if (query) {
      searchTerm.textContent = `${searchInput.value}`;
    } else {
      searchTerm.textContent = "";
    }

    loadingSpinner.style.display = "none";
    userListEl.style.display = "flex";
  }, 3000);
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = searchInput.value.trim();
  applyFilters();

  searchIcon.addEventListener("click", (e) => {
    e.preventDefault()
    searchQuery = searchInput.value.trim();
    applyFilters();
  });
});

levelSlider.addEventListener("input", () => {
  const index = parseInt(levelSlider.value);
  updateSliderLabel(index);
});

main();
