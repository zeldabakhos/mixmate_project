export const fetchIngredients = async () => {
  try {
    const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list");
    const data = await res.json();

    console.log("🍸 Raw API data:", data); // ✅ Add this line to debug

    if (!data.drinks || data.drinks.length === 0) {
      throw new Error("No ingredients returned from API");
    }

    return data.drinks.map((item) => ({
      _id: item.strIngredient1.toLowerCase().replace(/\s+/g, "-"),
      name: item.strIngredient1,
      description: "Bar ingredient",
      unit: "ml",
      quantity: 1,
      imageUrl: `https://www.thecocktaildb.com/images/ingredients/${item.strIngredient1}-Medium.png`
    }));
  } catch (error) {
    console.error("❌ Error fetching ingredients:", error);
    return [];
  }
};
