import { initSearch } from "./components/searchBar.js";
import { fetchFoodsByNutrient } from "./api/nutritionApi.js";


function displayResults(groupedResults) {
  const container = document.getElementById("results-container");
  const section = document.querySelector(".results-section");

  container.innerHTML = "";

  if (Object.keys(groupedResults).length === 0) {
    container.innerHTML = "<p>No foods found for that nutrient.</p>";
  } else {
    Object.entries(groupedResults).forEach(([groupName, items]) => {
      const group = document.createElement("div");
      group.className = "food-item";

      const title = document.createElement("h3");
      title.textContent = capitalizeFirstLetter(groupName);
      group.appendChild(title);

      const toggle = document.createElement("button");
      toggle.textContent = "Show Variants";
      toggle.className = "toggle-btn";
      group.appendChild(toggle);

      const sublist = document.createElement("ul");
      sublist.style.display = "none";

      items.forEach((food) => {
        const subItem = document.createElement("li");
        subItem.innerHTML = `${food.name} <br><small>${food.nutrients.join(
          ", "
        )}</small>`;
        sublist.appendChild(subItem);
      });

      toggle.addEventListener("click", () => {
        const isVisible = sublist.style.display === "block";
        sublist.style.display = isVisible ? "none" : "block";
        toggle.textContent = isVisible ? "Show Variants" : "Hide Variants";
      });

      group.appendChild(sublist);
      container.appendChild(group);
    });
  }

  section.style.display = "block";
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

initSearch(displayResults);
