import axios from "axios";
import { BASE_URL, getAuthHeader } from "./apiClient";

const API_URL = `${BASE_URL}/appointments`;

export const createAppointment = async (data) => {
  const response = await axios.post(API_URL, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateAppointment = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};