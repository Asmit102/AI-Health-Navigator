// Dynamic API Base URL supporting local development and deployed cloud servers (Vercel/Render/Railway)
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

// Standard Bearer Token header helper
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
