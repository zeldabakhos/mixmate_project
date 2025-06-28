import React, { useEffect, useState } from "react";
import DrinkCardComponent from "../components/DrinkCardComponent"; // adjust path if needed

const DrinksPage = () => {
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail");
        const data = await res.json();
        setDrinks(data.drinks); // idDrink, strDrink, strDrinkThumb
      } catch (error) {
        console.error("Error fetching drinks:", error);
      }
    };

    fetchDrinks();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">All Drinks</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {drinks.map((drink) => (
          <DrinkCardComponent key={drink.idDrink} drink={drink} />
        ))}
      </div>
    </div>
  );
};

export default DrinksPage;
