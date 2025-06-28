import React, { useState } from "react";

const DrinkCardComponent = ({ drink }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped(!flipped);

  return (
    <article className="col" onClick={handleFlip} style={{ cursor: "pointer" }}>
      <div className="card shadow-sm h-100">
      <img
        src={drink.strDrinkThumb}
        alt={drink.strDrink}
        className="card-img-top"
        />

        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 className="card-title">{drink.strDrink}</h5>

            {!flipped ? (
              <>
                <p className="card-text">Click to view ingredients</p>
              </>
            ) : (
              <>
                <p><strong>Ingredients:</strong></p>
                <ul>
                  {Object.keys(drink)
                    .filter(key => key.startsWith("strIngredient") && drink[key])
                    .map(key => (
                      <li key={key}>{drink[key]}</li>
                    ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default DrinkCardComponent;
