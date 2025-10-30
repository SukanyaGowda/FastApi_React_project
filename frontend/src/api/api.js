import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ✅ Automatically attach Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Register sends JSON
export const registerUser = async (data) => {
  return await API.post("/register", data, {
    headers: { "Content-Type": "application/json" },
  });
};

// ✅ Login sends FormData
export const loginUser = async (credentials) => {
  const formData = new FormData();
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);
  return await API.post("/token", formData);
};

// ✅ Protected product routes (token automatically attached)
export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);

// --- ADDED: CRUD Operations using the existing API instance ---

/**
 * Creates a new product.
 * Uses the API instance which handles token attachment automatically.
 * @param {object} productData - {name, description, price}
 */
export const createProduct = (productData) => {
    return API.post("/products", productData);
};

/**
 * Updates an existing product.
 * @param {number} id - The ID of the product to update.
 * @param {object} productData - The updated product data.
 */
export const updateProduct = (id, productData) => {
    return API.put(`/products/${id}`, productData);
};

/**
 * Deletes a product by ID.
 * @param {number} id - The ID of the product to delete.
 */
export const deleteProduct = (id) => {
    return API.delete(`/products/${id}`);
};