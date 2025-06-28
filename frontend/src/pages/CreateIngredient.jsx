import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import.meta.env.VITE_API_URL

const VITE_API_URL = import.meta.env.VITE_API_URL;

const CreateIngredient = () => {
  const [form, setForm] = useState({
    ingredientName: "",
    ingredientDescription: "",
    brand: "",
    model: "",
    stock: "",
    price: "",
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "image" && value) data.append("image", value);
      else data.append(key, value);
    });
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${VITE_API_URL}/api/ingredients/addIngredient`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        alert("Ingredient added!");
        navigate("/"); // redirect to HomePage after creation
      } else {
        alert(result.message || "Failed to add ingredient");
      }
    } catch (err) {
      alert(err.message || "Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4" style={{ maxWidth: 500, margin: "0 auto" }}>
      <h5>Add New ingredient</h5>
      <input
        name="ingredientName"
        className="form-control mb-2"
        placeholder="Name"
        value={form.ingredientName}
        onChange={handleChange}
        required
      />
      <input
        name="brand"
        className="form-control mb-2"
        placeholder="Brand"
        value={form.brand}
        onChange={handleChange}
        required
      />
      <input
        name="model"
        className="form-control mb-2"
        placeholder="Model"
        value={form.model}
        onChange={handleChange}
      />
      <input
        name="stock"
        type="number"
        className="form-control mb-2"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
        required
      />
      <input
        name="price"
        type="number"
        className="form-control mb-2"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />
      <textarea
        name="ingredientDescription"
        className="form-control mb-2"
        placeholder="Description"
        value={form.ingredientDescription}
        onChange={handleChange}
      />
      <input
        name="image"
        type="file"
        className="form-control mb-2"
        onChange={handleChange}
        accept="image/*"
      />
      <button type="submit" className="btn btn-primary">
        Add Ingredient
      </button>
    </form>
  );
};

export default CreateIngredient;
