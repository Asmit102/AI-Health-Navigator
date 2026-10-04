import axios from "axios";
import { BASE_URL, getAuthHeader } from "./apiClient";

const API_URL = `${BASE_URL}/vitals`;

export const logVital = async (data) => {
  const response = await axios.post(API_URL, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getMyVitals = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteVital = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
