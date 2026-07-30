import axios from "axios";

const API_URL = "http://localhost:4001/api/auth";

export const signupUser = async (payload) => {
  const response = await axios.post(`${API_URL}/register`, payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await axios.post(`${API_URL}/login`, payload);
  return response.data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};