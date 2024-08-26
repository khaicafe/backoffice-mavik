import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/users";

const getUsers = () => {
  return axios.get(API_URL);
};

const updateUserRole = (mobileNumber, role) => {
  return axios.put(`${API_URL}/role`, { mobile_number: mobileNumber, role });
};
const Api = {
  getUsers,
  updateUserRole,
};
export default Api;
