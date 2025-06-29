import React, { useState, useEffect } from "react";
import "./DrinkCardComponent.css";

const DrinkCardComponent = ({ drink }) => {
  const [flipped, setFlipped] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    if (flipped) {
      const fetchDrinkDetails = async () => {
        try {
          const res = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink || drink.id}`
          );
          const text = await res.text();

          if (!text) {
            console.warn("⚠️ Empty response from Cocktail DB");
            setIngredients(["Unavailable"]);
            return;
          }

          const data = JSON.parse(text);
          const drinkData = data.drinks?.[0];
          const parsed = [];

          for (let i = 1; i <= 15; i++) {
            const ingredient = drinkData?.[`strIngredient${i}`];
            if (ingredient) parsed.push(ingredient);
          }

          setIngredients(parsed.length > 0 ? parsed : ["No ingredients found"]);
        } catch (error) {
          console.error("❌ Failed to fetch ingredients:", error.message);
          setIngredients(["Error loading ingredients"]);
        }
      };

      fetchDrinkDetails();
    }
  }, [flipped, drink.idDrink, drink.id]);

  return (
    <div className="col">
      <div
        className={`flip-card ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <img
              src={
                drink.thumb?.startsWith("http")
                  ? drink.thumb
                  : drink.strDrinkThumb?.startsWith("http")
                  ? drink.strDrinkThumb
                  : "https://png.pngtree.com/png-clipart/20190921/original/pngtree-cartoon-drink-png-image_4764143.jpg"
              }
              alt={drink.name || drink.strDrink || "Drink"}
              className="card-img-top"
              onError={(e) => {
                if (!e.target.src.includes("cartoon-drink-png-image")) {
                  console.warn("❌ Broken image URL:", e.target.src);
                  e.target.src =
                    "https://png.pngtree.com/png-clipart/20190921/original/pngtree-cartoon-drink-png-image_4764143.jpg";
                }
              }}
            />

            <div className="card-body text-center p-2">
              <h5>{drink.name || drink.strDrink}</h5>
              <small>Click to view ingredients</small>
            </div>
          </div>
          <div className="flip-card-back p-3">
            <h5>Ingredients</h5>
            <ul>
              {ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkCardComponent;
