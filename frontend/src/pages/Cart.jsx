import React, { useEffect, useState } from "react";
import.meta.env.VITE_API_URL

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${VITE_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to load cart");
        const data = await response.json();
        setCart(data.items || []); // assuming your API returns { items: [...] }
      } catch (err) {
        setCart([]);
      }
      setLoading(false);
    };
    fetchCart();
  }, []);

  // Update quantity
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${VITE_API_URL}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: Number(newQuantity) })
      });
      if (!response.ok) throw new Error("Failed to update quantity");
      const data = await response.json();
      setCart(data.items || []);
    } catch (err) {
      alert(err.message || "Error updating quantity.");
    }
  };
  

  // Remove from cart
  const handleRemove = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${VITE_API_URL}/api/cart/remove`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ productId })
      });
      if (!response.ok) throw new Error("Failed to remove item");
      const data = await response.json();
      setCart(data.items || []);
    } catch (err) {
      alert(err.message || "Error removing item.");
    }
  };
  

  const total = cart && cart.length
  ? cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
  : 0;
<td colSpan={2} className="fw-bold">${isNaN(total) ? 0 : total}</td>

  if (loading) return <div className="container py-4"><p>Loading cart...</p></div>;

  return (
    <div className="container py-4">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Image</th>
                <th>Model</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={item._id || idx}>
                  <td>{item.productName}</td>
                  <td>
                    <img src={item.imageUrl} alt={item.productName} style={{ width: 70, height: 50, objectFit: "cover" }} />
                  </td>
                  <td>{item.model}</td>
                  <td>${item.price}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      style={{ width: 60 }}
                      onChange={e => handleQuantityChange(item.productId || item._id, e.target.value)}
                    />
                  </td>
                  <td>${item.price * item.quantity}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item.productId || item._id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={5} className="text-end fw-bold">Total:</td>
                <td colSpan={2} className="fw-bold">${total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Cart;
