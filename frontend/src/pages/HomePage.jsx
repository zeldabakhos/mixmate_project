import { useEffect, useState } from "react";
import { fetchIngredients } from "../utils/fetchIngredients.js";
import CardComponent from "../components/CardComponent.jsx";
import { useNavigate } from "react-router-dom";
import.meta.env.VITE_API_URL

const VITE_API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    ingredientName: "",
    ingredientDescription: "",
    brand: "",
    model: "",
    stock: "",
    price: "",
    image: null,
    imageUrl: "",
  });

  const isAdmin = localStorage.getItem("role") === "admin";
  const navigate = useNavigate();

  useEffect(() => {
    loadIngredients();
    // eslint-disable-next-line
  }, []);

  const loadIngredients = async () => {
    setLoading(true);
    try {
      const data = await fetchIngredients();
      setIngredients(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEditClick = (ingredient) => {
    setEditId(ingredient._id);
    setEditForm({
      ingredientName: ingredient.ingredientName || "",
      ingredientDescription: ingredient.ingredientDescription || "",
      brand: ingredient.brand || "",
      model: ingredient.model || "",
      stock: ingredient.stock || "",
      price: ingredient.price || "",
      image: null,
      imageUrl: ingredient.imageUrl || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      if (key === "image" && value) data.append("image", value);
      else if (key !== "imageUrl") data.append(key, value);
    });

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${VITE_API_URL}/api/ingredients/updateIngredient/${editId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Ingredient updated!");
        setEditId(null);
        setEditForm({
          ingredientName: "",
          ingredientDescription: "",
          brand: "",
          model: "",
          stock: "",
          price: "",
          image: null,
          imageUrl: "",
        });
        loadIngredients();
      } else {
        alert(result.message || "Failed to update ingredient");
      }
    } catch (err) {
      alert(err.message || "Network error");
    }
  };

  const handleDelete = async (ingredientId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this ingredient?")) return;
    try {
      const response = await fetch(`${VITE_API_URL}/api/ingredients/deleteIngredient/${ingredientId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setIngredients(ingredients.filter((p) => p._id !== ingredientId));
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete");
      }
    } catch (err) {
      alert(err.message || "Network error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {/* ingredients List */}
      <section className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {ingredients.length > 0 ? (
          ingredients.map((ingredient) => (
            <div key={ingredient._id || ingredient.id} className="col">
              {editId === ingredient._id ? (
                <form onSubmit={handleEditSubmit} className="card p-3 mb-4">
                  <h5>Edit Ingredient</h5>
                  {editForm.image ? (
                    <img
                      src={URL.createObjectURL(editForm.image)}
                      alt="Preview"
                      style={{ width: "100%", marginBottom: 10, maxHeight: 180, objectFit: "cover" }}
                    />
                  ) : editForm.imageUrl ? (
                    <img
                      src={editForm.imageUrl}
                      alt="Current"
                      style={{ width: "100%", marginBottom: 10, maxHeight: 180, objectFit: "cover" }}
                    />
                  ) : null}
                  <input name="ingredientName" className="form-control mb-2" placeholder="Name" value={editForm.ingredientName} onChange={handleEditFormChange} required />
                  <input name="brand" className="form-control mb-2" placeholder="Brand" value={editForm.brand} onChange={handleEditFormChange} required />
                  <input name="model" className="form-control mb-2" placeholder="Model" value={editForm.model} onChange={handleEditFormChange} />
                  <input name="stock" type="number" className="form-control mb-2" placeholder="Stock" value={editForm.stock} onChange={handleEditFormChange} required />
                  <input name="price" type="number" className="form-control mb-2" placeholder="Price" value={editForm.price} onChange={handleEditFormChange} required />
                  <textarea name="ingredientDescription" className="form-control mb-2" placeholder="Description" value={editForm.ingredientDescription} onChange={handleEditFormChange} />
                  <input name="image" type="file" className="form-control mb-2" onChange={handleEditFormChange} accept="image/*" />
                  <button type="submit" className="btn btn-primary me-2">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <CardComponent
                    ingredient={ingredient}
                    title={ingredient.ingredientName}
                    description={ingredient.ingredientDescription}
                    price={ingredient.price}
                    imageUrl={ingredient.imageUrl || "https://placehold.co/300x200"}
                  />
                  {isAdmin && (
                    <>
                      <button className="btn btn-danger mt-2 me-2" onClick={() => handleDelete(ingredient._id)}>Delete</button>
                      <button className="btn btn-warning mt-2" onClick={() => handleEditClick(ingredient)}>Edit</button>
                    </>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center">No ingredients found.</p>
        )}
      </section>

      {/* Add ingredient Button (Admins only) */}
      {isAdmin && (
        <div className="mb-3 mt-4 text-center">
          <button className="btn btn-success" onClick={() => navigate("/add-ingredient")}>
            + Add ingredient
          </button>
        </div>
      )}
    </>
  );
};

export default HomePage;
