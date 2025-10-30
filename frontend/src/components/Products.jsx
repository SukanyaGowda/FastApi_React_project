import React, { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Products.css"; // Ensure this CSS file is correctly imported and updated

// --- Modal Component for Create/Update (UPDATED) ---
const ProductFormModal = ({ product, onClose, onSave }) => {
    // 🚨 UPDATED: Added quantity and imageUrl to the initial state
    const [formData, setFormData] = useState(product || { 
        name: "", 
        description: "", 
        price: 0, 
        quantity: 0, // NEW FIELD
        image_url: "" // NEW FIELD (using image_url to match common API snake_case)
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Handle number types correctly
        const newValue = (name === "price" || name === "quantity") ? Number(value) : value;
        
        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2 className="modal-title">{product ? "Edit Product" : "Create New Product"}</h2>
                <form onSubmit={handleSubmit}>
                    
                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input name="name" id="name" type="text" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="description">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} required />
                    </div>

                    <div className="input-group-row">
                        <div className="input-group">
                            <label htmlFor="price">Price (₹)</label>
                            <input name="price" id="price" type="number" value={formData.price} onChange={handleChange} min="0" required />
                        </div>
                        {/* 🚨 NEW FIELD: Quantity */}
                        <div className="input-group">
                            <label htmlFor="quantity">Quantity</label>
                            <input name="quantity" id="quantity" type="number" value={formData.quantity} onChange={handleChange} min="0" required />
                        </div>
                    </div>

                    {/* 🚨 NEW FIELD: Image URL */}
                    <div className="input-group">
                        <label htmlFor="image_url">Image URL</label>
                        <input name="image_url" id="image_url" type="url" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="button-save">{product ? "Update" : "Create"}</button>
                        <button type="button" onClick={onClose} className="button-cancel">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Products Component ---
function Products() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null); 
    const navigate = useNavigate();
    
    // Core Read Logic (DO NOT CHANGE)
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

    useEffect(() => {
        fetchProducts();
    }, [navigate]);
    // End of Core Read Logic


    // --- CRUD Handlers ---

    const handleCreateUpdate = async (productData) => {
        setError("");
        try {
            if (productData.id) {
                // Update
                await updateProduct(productData.id, productData);
            } else {
                // Create
                await createProduct(productData);
            }
            setIsModalOpen(false);
            setCurrentProduct(null);
            fetchProducts(); // Refresh the list
        } catch (err) {
            console.error("CRUD Error:", err.response?.data);
            setError(`Operation failed: ${err.response?.data?.detail || err.message || "Unknown error"}`);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete the product: ${name}?`)) {
            return;
        }
        setError("");
        try {
            await deleteProduct(id);
            fetchProducts(); // Refresh the list
        } catch (err) {
            console.error("Delete Error:", err.response?.data);
            setError(`Delete failed: ${err.response?.data?.detail || err.message || "Unknown error"}`);
        }
    };

    const openCreateModal = () => {
        setCurrentProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };


    // --- Render ---

    return (
        <div className="product-page-container">
            <header className="product-header-section">
                <h1 className="product-main-title">
                    <span>🛍️</span> Products
                </h1>
                {/* Create Button */}
                <button 
                    onClick={openCreateModal} 
                    className="button-create-new"
                >
                    + Add New Product
                </button>
            </header>

            {error && <p className="product-error-message">{error}</p>}

            <div className="product-grid">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="product-card"
                    >
                        {/* 🚨 UPDATED: Display Image (optional, requires CSS update below) */}
                        {p.image_url && (
                             <div className="card-image-container">
                                 <img src={p.image_url} alt={p.name} className="card-image" />
                             </div>
                        )}
                        
                        <div className="card-info" onClick={() => navigate(`/products/${p.id}`)}>
                            <h2 className="card-title">{p.name}</h2>
                            <p className="card-description">{p.description}</p>
                        </div>
                        
                        <div className="card-footer">
                            <p className="card-quantity">In Stock: {p.quantity || 0}</p> {/* 🚨 DISPLAY QUANTITY */}
                            <p className="card-price">₹{p.price}</p>
                            <div className="card-actions">
                                {/* Update Button */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); openEditModal(p); }} 
                                    className="button-edit"
                                    title="Edit Product"
                                >
                                    ✏️
                                </button>
                                {/* Delete Button */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.name); }} 
                                    className="button-delete"
                                    title="Delete Product"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Modal */}
            {isModalOpen && (
                <ProductFormModal 
                    product={currentProduct}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleCreateUpdate}
                />
            )}
        </div>
    );
}

export default Products;