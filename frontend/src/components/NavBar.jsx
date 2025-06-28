import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import.meta.env.VITE_API_URL

const VITE_API_URL = import.meta.env.VITE_API_URL;

const NavBar = () => {
  const token = localStorage.getItem("token");
  const avatar = localStorage.getItem("avatar");
  const location = useLocation();
  const navigate = useNavigate();

  // --- NEW: Cart state from backend ---
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    if (!token) {
      setCartQuantity(0);
      return;
    }
    // Fetch cart from backend
    const fetchCart = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        // Calculate total quantity
        const total = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
        setCartQuantity(total);
      } catch (err) {
        setCartQuantity(0);
      }
    };
    fetchCart();
  }, [token]);

  // If you want the cart count to update after add-to-cart, consider using a Context/global state.

  const hideNav =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-dark d-flex align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div className="container-fluid">
        {!hideNav && (
          <Link className="navbar-brand" to="/">
            E-commerce
          </Link>
        )}
        <div className="col-md-3 text-end d-flex align-items-center justify-content-end gap-2">
          {/* CART ICON (only when logged in) */}
          {token && (
            <Link to="/cart" className="btn btn-light position-relative me-2" title="View Cart">
              <i className="bi bi-cart3" style={{ fontSize: 28 }}></i>
              
            </Link>
          )}

          {/* Show avatar if logged in and avatar exists */}
          {token && avatar && avatar !== "" && (
            <img
              src={`${VITE_API_URL}/${avatar.replace(/\\/g, "/")}`}
              alt="avatar"
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid white",
                marginLeft: "10px"
              }}
            />
          )}
          {!token && location.pathname !== "/login" && (
            <Link className="btn btn-outline-dark me-2" to="/login">
              Login
            </Link>
          )}
          {!token && location.pathname !== "/signup" && (
            <Link className="btn btn-success" to="/signup">
              Sign-up
            </Link>
          )}
          {token && (
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
