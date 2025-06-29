import React from "react";
import { useNavigate } from "react-router-dom";
import.meta.env.VITE_API_URL;

const VITE_API_URL = import.meta.env.VITE_API_URL;

const CardComponent = ({
  ingredient,
  title,
  description,
  unit,
  quantity,
  imageUrl,
  showAddToFridgeButton = true,
}) => {
  const navigate = useNavigate();

  const handleAddToFridge = async () => {
    const token = localStorage.getItem("token");
    console.log("🪪 Token used:", token);
    if (!token) {
      alert("You must be logged in to add to fridge");
      return;
    }
    try {
      console.log("🧪 Adding ingredient:", title);
      const res = await fetch(`${VITE_API_URL}/api/fridge/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: title,
          imageUrl: imageUrl || "https://placehold.co/300x200",
          quantity: 1
        }),
      });
      if (!res.ok) throw new Error("Failed to add to fridge");
      alert("Added to fridge!");
    } catch (err) {
      console.error("❌ Add to fridge error:", err);
      alert(err.message || "Error adding to fridge");
    }
  };
  

  return (
    <article className="col">
      <div className="card shadow-sm h-100">
        <img
          src={imageUrl}
          alt={title}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <p className="card-text">
              <strong>Available:</strong> {quantity} {unit}
            </p>
          </div>
          <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => navigate(`/ingredients/${ingredient._id}`)}
            >
              View
            </button>
            {showAddToFridgeButton && (
              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={handleAddToFridge}
                title="Add to fridge"
              >
                ➕
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CardComponent;
