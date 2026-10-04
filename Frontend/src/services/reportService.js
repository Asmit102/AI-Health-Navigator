import axios from "axios";
import { BASE_URL, getAuthHeader } from "./apiClient";

const API_URL = `${BASE_URL}/reports`;

export const uploadReport = async (file) => {
  const formData = new FormData();
  formData.append("report", file);

  const response = await axios.post(API_URL, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getMyReports = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};