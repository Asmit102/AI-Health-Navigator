import axios from "axios";
import { BASE_URL, getAuthHeader } from "./apiClient";

const API_URL = `${BASE_URL}/prep`;

export const getPrepForAppointment = async (appointmentId) => {
  const response = await axios.get(`${API_URL}/${appointmentId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updatePrep = async (prepId, notes) => {
  const response = await axios.put(
    `${API_URL}/${prepId}`,
    { notes },
    { headers: getAuthHeader() }
  );
  return response.data;
};