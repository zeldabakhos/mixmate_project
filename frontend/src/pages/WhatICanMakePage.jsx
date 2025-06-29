import React, { useEffect, useState } from "react";
import DrinkCardComponent from "../components/DrinkCardComponent";

const WhatICanMakePage = () => {
  const [fridgeIngredients, setFridgeIngredients] = useState([]);
  const [drinks, setDrinks] = useState([]);

  // STEP 1 - Fetch ingredients from your fridge
  const fetchFridgeIngredients = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:4000/api/fridge", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.map((item) => item.name.toLowerCase());
  };

  // ✅ STEP 2 - Fetch full data for each drink
  const fetchFullDrinkData = async (drinkList) => {
    const detailedDrinks = await Promise.all(
      drinkList.map(async (drink) => {
        const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`);
        const data = await res.json();
        return data.drinks[0]; // full details
      })
    );
    return detailedDrinks;
  };

  const filterDrinksByFridge = (drinks, fridgeIngredients) => {
    return drinks.filter((drink) => {
      const ingredients = [];
  
      // Collect strIngredient1 to strIngredient15 (some might be null)
      for (let i = 1; i <= 15; i++) {
        const ing = drink[`strIngredient${i}`];
        if (ing) ingredients.push(ing.toLowerCase());
      }
  
      // Return true only if ALL ingredients are in the fridge
      return ingredients.every((ing) => fridgeIngredients.includes(ing));
    });
  };
  
  // Fetch fridge + all drinks + filter
  useEffect(() => {
    const loadData = async () => {
        const fridge = await fetchFridgeIngredients();
      
        const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail");
        const data = await res.json();
      
        const fullDrinks = await fetchFullDrinkData(data.drinks);
        const filteredDrinks = filterDrinksByFridge(fullDrinks, fridge);
      
        setFridgeIngredients(fridge);
        setDrinks(filteredDrinks);
      };
    

    loadData();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">What I Can Make</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {drinks.map((drink) => (
          <DrinkCardComponent key={drink.idDrink} drink={drink} />
        ))}
      </div>
    </div>
  );
};

export default WhatICanMakePage;
