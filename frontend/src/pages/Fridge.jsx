import React, { useEffect, useState } from "react";
import.meta.env.VITE_API_URL

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Fridge = () => {
  const [fridge, setFridge] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Fridge from backend on mount
  useEffect(() => {
    const fetchFridge = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${VITE_API_URL}/api/fridge`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to load fridge");
        const data = await response.json();

        console.log("🍹 Fetched fridge items:", data.items);

        setFridge(data.items || []);
      } catch (err) {
        setFridge([]);
      }
      setLoading(false);
    };
    fetchFridge();
  }, []);

  // Update quantity
  const handleQuantityChange = async (ingredientId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${VITE_API_URL}/api/fridge/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ingredientId, quantity: Number(newQuantity) })
      });
      if (!response.ok) throw new Error("Failed to update quantity");
      const data = await response.json();
      setFridge(data.items || []);
    } catch (err) {
      alert(err.message || "Error updating quantity.");
    }
  };
  

  // Remove from fridge
  const handleRemove = async (ingredientId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${VITE_API_URL}/api/fridge/remove`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ ingredientId })
      });
      if (!response.ok) throw new Error("Failed to remove item");
      const data = await response.json();
      setFridge(data.items || []);
    } catch (err) {
      alert(err.message || "Error removing item.");
    }
  };
  

  const total = fridge && fridge.length
  ? fridge.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
  : 0;
<td colSpan={2} className="fw-bold">${isNaN(total) ? 0 : total}</td>

  if (loading) return <div className="container py-4"><p>Loading fridge...</p></div>;

  return (
    <div className="container py-4">
      <h2>Your fridge</h2>
      {fridge.length === 0 ? (
        <p>Your fridge is empty.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Image</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fridge.map((item, idx) => (
                <tr key={item._id || idx}>
                  <td>{item.name}</td>
                  <td>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{ width: 70, height: 50, objectFit: "cover" }}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(item.ingredientId || item._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Fridge;
