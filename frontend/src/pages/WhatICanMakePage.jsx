import React, { useEffect, useState } from "react";
import DrinkCardComponent from "../components/DrinkCardComponent";

// Use VITE_API_URL from Docker env
const API_BASE = import.meta.env.VITE_API_URL;

const WhatICanMakePage = () => {
  const [fridgeIngredients, setFridgeIngredients] = useState([]);
  const [drinks, setDrinks] = useState([]);

  // STEP 1 - Fetch ingredients from your fridge
  const fetchFridgeIngredients = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/fridge`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    console.log("🔍 Fridge API response:", data);

    const items = Array.isArray(data) ? data : data.items || [];
    return items.map((item) => item.name.toLowerCase());
  };

  // STEP 2 - Fetch full data for each drink
  const fetchFullDrinkData = async (drinkList) => {
    const detailedDrinks = await Promise.all(
      drinkList.map(async (drink) => {
        const res = await fetch(`${API_BASE}/api/cocktail/details/${drink.idDrink}`);
        const data = await res.json();
        return data.drinks[0];
      })
    );
    return detailedDrinks;
  };

  const filterDrinksByFridge = (drinks, fridgeIngredients) => {
    return drinks.filter((drink) => {
      const ingredients = [];
      for (let i = 1; i <= 15; i++) {
        const ing = drink[`strIngredient${i}`];
        if (ing) ingredients.push(ing.toLowerCase());
      }
      return ingredients.every((ing) => fridgeIngredients.includes(ing));
    });
  };

  useEffect(() => {
    const loadMakeableDrinks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to view your possible drinks.");
        return;
      }
  
      try {
        const res = await fetch(`${API_BASE}/api/cocktail/makeable`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const text = await res.text();
        if (!res.ok) throw new Error(`Status ${res.status}: ${text}`);
        if (!text) throw new Error("Empty response body from /api/cocktail/makeable");
  
        const data = JSON.parse(text);
        console.log("✅ Drink data from /makeable:", data);
  
        const mappedDrinks = (data.drinks || []).map((d) => ({
          idDrink: d.id,
          strDrink: d.name,
          strDrinkThumb: d.thumbnail,
        }));
        setDrinks(mappedDrinks);
      } catch (err) {
        console.error("❌ Failed to load makeable drinks:", err.message);
      }
    };
  
    loadMakeableDrinks();
  }, []);  

  useEffect(() => {
    const loadFridgeIngredients = async () => {
      try {
        const ingredients = await fetchFridgeIngredients();
        console.log("🧊 Ingredients in fridge:", ingredients);
        setFridgeIngredients(ingredients);
      } catch (err) {
        console.error("❌ Failed to load fridge ingredients:", err.message);
      }
    };

    loadFridgeIngredients();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">What I Can Make</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {drinks.map((drink, index) => (
          <DrinkCardComponent key={drink?.idDrink || index} drink={drink} />
        ))}
      </div>
    </div>
  );
};

export default WhatICanMakePage;
