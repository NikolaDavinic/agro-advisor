import axios from "axios";
import { getAuthToken } from "./authToken";

axios.interceptors.request.use(
  (request) => {
    const token = getAuthToken();

    if (token) {
      request.headers!["Authorization"] = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    Promise.reject(error);
  }
);
