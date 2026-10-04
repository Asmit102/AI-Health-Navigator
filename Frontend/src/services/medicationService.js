import axios from "axios";
import { BASE_URL, getAuthHeader } from "./apiClient";

const API_URL = `${BASE_URL}/medications`;

// Run AI Medication Safety & Interaction Analysis
export const checkMedicationSafety = async (data) => {
  const response = await axios.post(`${API_URL}/check`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get past safety analyses
export const getSafetyHistory = async () => {
  const response = await axios.get(`${API_URL}/history`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Delete record
export const deleteSafetyRecord = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
