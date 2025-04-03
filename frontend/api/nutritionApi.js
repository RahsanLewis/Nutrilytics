const API_KEY = "2RJFz4agPvZJN6rwuFiGxegfeU0zfPQkVm6WLkJ3";

const nutrientMap = {
  "vitamin a": 1104,
  "vitamin c": 1162,
  iron: 1089,
  calcium: 1087,
  protein: 1003,
  // Add more nutrients as needed
};

export async function fetchFoodsByNutrient(nutrientName) {
  const nutrientId = nutrientMap[nutrientName.toLowerCase()];
  if (!nutrientId) return {};

  try {
    const response = await fetch("http://127.0.0.1:5050/api/nutrition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: nutrientName,
        dataType: ["Foundation", "SR Legacy"],
        pageSize: 200,
      }),
    });

    const data = await response.json();

    if (!Array.isArray(data.foods)) {
      console.error("Unexpected response shape:", data);
      return {};
    }

    console.log("First food item:", data.foods[0]);

    const foodsWithNutrient = data.foods
      .filter((food) =>
        food.foodNutrients?.some(
          (n) => n.nutrientId === nutrientId && n.value > 0
        )
      )
      .map((food) => {
        const nutrient = food.foodNutrients.find(
          (n) => n.nutrientId === nutrientId
        );
        return {
          name: food.description,
          nutrients: [
            `${nutrient.nutrientName} (${nutrient.value}${nutrient.unitName})`,
          ],
        };
      });

    return groupFoodsByName(foodsWithNutrient);
  } catch (error) {
    console.error("Error fetching foods:", error);
    return {};
  }
}

function groupFoodsByName(foods) {
  const groups = {};
  foods.forEach((food) => {
    const groupKey = food.name.split(",")[0].trim().toLowerCase();
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(food);
  });
  return groups;
}
