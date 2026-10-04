import axios from "axios";
import { BASE_URL, getAuthHeader } from "./apiClient";

const API_URL = `${BASE_URL}/visits`;

export const createVisitRecord = async (data) => {
  const response = await axios.post(API_URL, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getMyVisitRecords = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getVisitById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteVisitRecord = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
