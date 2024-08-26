import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/users";

const getUsers = () => {
  return axios.get(`${API_URL}/all`);
};
const createUser = async (user) => {
  return await axios.post(`${API_URL}`, user);
}

const updateUserRole = (mobileNumber, role) => {
  return axios.put(`${API_URL}/role`, { mobile_number: mobileNumber, role });
};

const deleteUser = (mobileNumber) => {
  return axios.delete(`${API_URL}/${mobileNumber}`);
};

const Api = {
  getUsers,
  createUser,
  deleteUser,
  updateUserRole,
};
export default Api;
