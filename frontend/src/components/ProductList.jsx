import React, { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load products. Try again later.");
        }
      }
    };
    fetchProducts();
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-semibold">Product List</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded-lg shadow hover:shadow-xl cursor-pointer"
            onClick={() => navigate(`/products/${p.id}`)}
          >
            <h2 className="font-bold text-lg">{p.name}</h2>
            <p>{p.description}</p>
            <p className="text-blue-600">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
