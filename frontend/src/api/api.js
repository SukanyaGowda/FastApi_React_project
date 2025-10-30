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
