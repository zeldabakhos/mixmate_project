import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import.meta.env.VITE_API_URL

const VITE_API_URL = import.meta.env.VITE_API_URL;

const IngredientDetails = () => {
  const { id } = useParams();
  const [ingredient, setIngredient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch single Ingredient
    fetch(`${VITE_API_URL}/api/ingredients/seeIngredient/${id}`)
    .then(res => res.json())
      .then(data => {
        setIngredient(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!ingredient) return <p>Ingredient not found</p>;

  return (
    <div className="container mt-4">
      <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
        <img
          src={ingredient.imageUrl || "https://placehold.co/300x200"}
          alt={ingredient.ingredientName}
          className="card-img-top"
          style={{ maxHeight: 300, objectFit: "cover" }}
        />
        <div className="card-body">
          <h3 className="card-title">{ingredient.ingredientName}</h3>
          <p className="card-text"><strong>Brand:</strong> {ingredient.brand}</p>
          <p className="card-text"><strong>Model:</strong> {ingredient.model}</p>
          <p className="card-text"><strong>Description:</strong> {ingredient.ingredientDescription}</p>
          <p className="card-text"><strong>Stock:</strong> {ingredient.stock}</p>
          <p className="card-text"><strong>Price:</strong> ${ingredient.price}</p>
          {/* Add to Fridge button */}
          <button
            className="btn btn-success mt-2"
            onClick={async () => {
              const token = localStorage.getItem("token");
              if (!token) {
                alert("You must be logged in to add to fridge");
                return;
              }
              try {
                const res = await fetch(`${VITE_API_URL}/api/fridge/add`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    ingredientId: ingredient._id,
                    quantity: 1,
                  }),
                });
                if (!res.ok) throw new Error("Failed to add to fridge");
                alert("Added to fridge!");
              } catch (err) {
                alert(err.message || "Error adding to fridge");
              }
            }}
          >
            Add to fridge
          </button>
          <button className="btn btn-secondary mt-2 ms-2" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetails;
