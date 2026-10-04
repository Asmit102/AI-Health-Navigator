import axios from "axios";
import { BASE_URL, getAuthHeader } from "./apiClient";

const API_URL = `${BASE_URL}/family`;

export const addFamilyMember = async (data) => {
  const response = await axios.post(API_URL, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getFamilyMembers = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateFamilyMember = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteFamilyMember = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};