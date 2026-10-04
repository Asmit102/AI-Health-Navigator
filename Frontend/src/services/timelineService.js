import axios from "axios";
import { BASE_URL, getAuthHeader } from "./apiClient";

const API_URL = `${BASE_URL}/timeline`;

export const getTimeline = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};