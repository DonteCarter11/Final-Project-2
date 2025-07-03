// // // API 1: "https://jsonplaceholder.typicode.com/users"
// // // API 2: "https://jsonplaceholder.typicode.com/posts?userId=:id"

// // //Api: https://digimon-api.vercel.app/api/digimon



  const userListEl = document.querySelector(".user__list");
    const searchInput = document.getElementById("search");
    const levelSlider = document.getElementById("level__filter");
    const currentLevelLabel = document.getElementById("selectedLevel");
    const searchForm = document.getElementById("search__form")
    const searchTerm = document.querySelector(".search__term")    

    let allDigimon = [];
    let uniqueLevels = ["All"];
    let selectedLevel = "All";
    let searchQuery = ""

    async function main() {
      const res = await fetch("https://digimon-api.vercel.app/api/digimon");
      const data = await res.json();
      allDigimon = data;

      // Get unique levels and update slider
      const levelsFromData = [...new Set(data.map(d => d.level))];
      uniqueLevels = ["All", ...levelsFromData];
      levelSlider.max = uniqueLevels.length - 1;
      updateSliderLabel(0);
      renderList(allDigimon);
    }

    function updateSliderLabel(index) {
      selectedLevel = uniqueLevels[index];
      // currentLevelLabel.textContent = selectedLevel;
      applyFilters();
    }

    function renderList(list) {
      userListEl.innerHTML = list.map(user => `
        <div class="user-card">
          <h3>${user.name}</h3>
          <img src="${user.img}" alt="${user.name}" />
          <p>Level: ${user.level}</p>
        </div>
      `).join("");
  
    }

    function applyFilters() {
      const query = searchInput.value.toLowerCase();
      const filtered = allDigimon.filter(d => {
        const matchName = d.name.toLowerCase().includes(query);
        const matchLevel = selectedLevel === "All" || d.level === selectedLevel;
        return matchName && matchLevel;
      });
      renderList(filtered);
    }

    // searchInput.addEventListener("input", applyFilters);
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      searchQuery = searchInput.value.trim()
      // searchTerm.textContent = searchQuery || 
      applyFilters()
    })

    levelSlider.addEventListener("input", () => {
      const index = parseInt(levelSlider.value);
      updateSliderLabel(index);
    });

    main();