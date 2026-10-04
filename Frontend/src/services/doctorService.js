import axios from "axios";
import { BASE_URL, getAuthHeader } from "./apiClient";

const API_URL = `${BASE_URL}/doctor`;

export const getDoctorQueue = async () => {
  const response = await axios.get(`${API_URL}/queue`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getDoctorStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getPatientPrepSummary = async (appointmentId) => {
  const response = await axios.get(`${API_URL}/prep/${appointmentId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  const response = await axios.put(
    `${API_URL}/appointments/${appointmentId}/status`,
    { status },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const getAllPatientReports = async () => {
  const response = await axios.get(`${API_URL}/reports`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
