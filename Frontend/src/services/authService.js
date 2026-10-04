import axios from "axios";
import { BASE_URL, getAuthHeader } from "./apiClient";

export { getAuthHeader };

const API_URL = `${BASE_URL}/auth`;

export const signupUser = async (payload) => {
  const response = await axios.post(`${API_URL}/register`, payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await axios.post(`${API_URL}/login`, payload);
  return response.data;
};

export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axios.put(`${API_URL}/profile`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};