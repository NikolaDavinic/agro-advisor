import axios from "axios";
import { constants } from "crypto";
import { lsGetSession } from "./api/authToken";
import { apiEndpoint } from "./constants";

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
