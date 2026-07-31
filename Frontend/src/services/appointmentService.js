import axios from "axios";

const API_URL = "http://localhost:4001/api/appointments";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const createAppointment = async (data) => {
  const response = await axios.post(API_URL, data, getAuthHeader());
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const updateAppointment = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};