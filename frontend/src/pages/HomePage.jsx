import { useEffect, useState } from "react";
import { fetchProducts } from "../utils/fetchProducts.js";
import CardComponent from "../components/CardComponent.jsx";
import { useNavigate } from "react-router-dom";
import.meta.env.VITE_API_URL

const VITE_API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    productName: "",
    productDescription: "",
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
    loadProducts();
    // eslint-disable-next-line
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
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

  const handleEditClick = (product) => {
    setEditId(product._id);
    setEditForm({
      productName: product.productName || "",
      productDescription: product.productDescription || "",
      brand: product.brand || "",
      model: product.model || "",
      stock: product.stock || "",
      price: product.price || "",
      image: null,
      imageUrl: product.imageUrl || "",
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
      const response = await fetch(`${VITE_API_URL}/api/products/updateProduct/${editId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Product updated!");
        setEditId(null);
        setEditForm({
          productName: "",
          productDescription: "",
          brand: "",
          model: "",
          stock: "",
          price: "",
          image: null,
          imageUrl: "",
        });
        loadProducts();
      } else {
        alert(result.message || "Failed to update product");
      }
    } catch (err) {
      alert(err.message || "Network error");
    }
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await fetch(`${VITE_API_URL}/api/products/deleteProduct/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productId));
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
      {/* Products List */}
      <section className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id || product.id} className="col">
              {editId === product._id ? (
                <form onSubmit={handleEditSubmit} className="card p-3 mb-4">
                  <h5>Edit Product</h5>
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
                  <input name="productName" className="form-control mb-2" placeholder="Name" value={editForm.productName} onChange={handleEditFormChange} required />
                  <input name="brand" className="form-control mb-2" placeholder="Brand" value={editForm.brand} onChange={handleEditFormChange} required />
                  <input name="model" className="form-control mb-2" placeholder="Model" value={editForm.model} onChange={handleEditFormChange} />
                  <input name="stock" type="number" className="form-control mb-2" placeholder="Stock" value={editForm.stock} onChange={handleEditFormChange} required />
                  <input name="price" type="number" className="form-control mb-2" placeholder="Price" value={editForm.price} onChange={handleEditFormChange} required />
                  <textarea name="productDescription" className="form-control mb-2" placeholder="Description" value={editForm.productDescription} onChange={handleEditFormChange} />
                  <input name="image" type="file" className="form-control mb-2" onChange={handleEditFormChange} accept="image/*" />
                  <button type="submit" className="btn btn-primary me-2">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <CardComponent
                    product={product}
                    title={product.productName}
                    description={product.productDescription}
                    price={product.price}
                    imageUrl={product.imageUrl || "https://placehold.co/300x200"}
                  />
                  {isAdmin && (
                    <>
                      <button className="btn btn-danger mt-2 me-2" onClick={() => handleDelete(product._id)}>Delete</button>
                      <button className="btn btn-warning mt-2" onClick={() => handleEditClick(product)}>Edit</button>
                    </>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center">No products found.</p>
        )}
      </section>

      {/* Add Product Button (Admins only) */}
      {isAdmin && (
        <div className="mb-3 mt-4 text-center">
          <button className="btn btn-success" onClick={() => navigate("/add-product")}>
            + Add Product
          </button>
        </div>
      )}
    </>
  );
};

export default HomePage;
