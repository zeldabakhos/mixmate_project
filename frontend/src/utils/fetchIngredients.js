const uri = `http://localhost:4000/api/ingredients/seeingredient`;

export const fetchIngredients = async () => {
  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
};
