import React, { useState, useEffect } from "react";
import "./DrinkCardComponent.css"; // make sure this file exists or create it

const DrinkCardComponent = ({ drink }) => {
  const [flipped, setFlipped] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    if (flipped) {
      fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`)
        .then(res => res.json())
        .then(data => {
          const drinkData = data.drinks?.[0];
          const parsed = [];

          for (let i = 1; i <= 15; i++) {
            const ingredient = drinkData[`strIngredient${i}`];
            if (ingredient) parsed.push(ingredient);
          }

          setIngredients(parsed);
        });
    }
  }, [flipped, drink.idDrink]);

  return (
    <div className="col">
      <div
        className={`flip-card ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
          <img
            src={drink.strDrinkThumb}
            alt={drink.strDrink}
            className="card-img-top"
            />

            <div className="card-body text-center p-2">
              <h5>{drink.strDrink}</h5>
              <small>Click to view ingredients</small>
            </div>
          </div>
          <div className="flip-card-back p-3">
            <h5>Ingredients</h5>
            <ul>
              {ingredients.length > 0 ? (
                ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)
              ) : (
                <li>Loading...</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkCardComponent;
