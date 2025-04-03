import { fetchFoodsByNutrient } from "../api/nutritionApi.js";

const suggestions = [
  "Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D", "Vitamin E", "Vitamin K",
  "Calcium", "Iron", "Magnesium", "Potassium", "Fiber", "Protein", "Zinc", "Folate",
  "Omega-3", "Beta-carotene"
];

export function initSearch(displayResults) {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-btn");
  const autocompleteList = document.getElementById("autocomplete-list");

  async function handleSearch() {
    const keyword = input.value.trim();
    if (keyword) {
      const results = await fetchFoodsByNutrient(keyword);
      displayResults(results);
      autocompleteList.innerHTML = "";
    }
  }

  function showSuggestions(inputValue) {
    autocompleteList.innerHTML = "";

    if (!inputValue) return;

    const filtered = suggestions
    .filter(term => term.toLowerCase().startsWith(inputValue.toLowerCase()))
    .slice(0, 5); // Limit to 5 suggestions

    filtered.forEach(term => {
      const item = document.createElement("div");
      item.textContent = term;
      item.addEventListener("click", () => {
        input.value = term;
        autocompleteList.innerHTML = "";
        handleSearch(); // Optional: remove this if you don't want it to auto-search on click
      });
      autocompleteList.appendChild(item);
    });
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  input.addEventListener("input", (e) => {
    showSuggestions(e.target.value.trim());
  });

  button.addEventListener("click", handleSearch);
}
