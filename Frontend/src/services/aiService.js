import axios from "axios";
import { BASE_URL, getAuthHeader } from "./apiClient";

const API_URL = `${BASE_URL}/ai`;

export const askAssistant = async (message) => {
  const response = await axios.post(
    `${API_URL}/assistant`,
    { message },
    { headers: getAuthHeader() }
  );
  return response.data;
};