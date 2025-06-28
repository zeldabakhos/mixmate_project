import React from "react";
import { useNavigate } from "react-router-dom";
import.meta.env.VITE_API_URL

const VITE_API_URL = import.meta.env.VITE_API_URL;

const CardComponent = ({ product, title, description, price, imageUrl }) => {
  const navigate = useNavigate();

  // Add to fridge handler
  const handleAddToFridge = async () => {
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
          productId: product._id,  // or whatever the ID field is
          quantity: 1
        })
      });
      if (!res.ok) throw new Error("Failed to add to fridge");
      alert("Added to fridge!");
    } catch (err) {
      alert(err.message || "Error adding to fridge");
    }
  };
  

  return (
    <article className="col">
      <div className="card shadow-sm">
        <img src={imageUrl} alt="Product" style={{ width: "100%", height: "auto" }} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <p className="card-text">
            <strong>Price: ${price}</strong>
          </p>
          <div className="d-flex justify-content-end align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => navigate(`/products/${product._id}`)}
            >
              View
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={handleAddToFridge}
              title="Add to fridge"
            >
              🛒
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CardComponent;
