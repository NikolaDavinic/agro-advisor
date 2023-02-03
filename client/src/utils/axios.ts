import axios from "axios";
import { apiEndpoint } from "../constants";
import { lsGetSession } from "./api/authToken";

export default axios;

const axiosInstance = axios.create({
  baseURL: apiEndpoint,
});

axiosInstance.interceptors.request.use(
  (request) => {
    const token = lsGetSession();

    if (token) {
      request.headers!["Authorization"] = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    Promise.reject(error);
  }
);

export const api = axiosInstance;
