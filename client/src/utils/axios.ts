import axios from "axios";
import { getAuthToken } from "./api/authToken";
import { apiEndpoint } from "./constants";

axios.defaults.baseURL = apiEndpoint;
axios.defaults.headers.common = {
  Authorization: `Bearer: ${getAuthToken()}`,
};

export default axios;
