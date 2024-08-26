import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/products";
const MODIFIER_URL = config.apiBaseUrl + "/modifiers";

const getAllProducts = () => {
  return axios.get(`${API_URL}`);
};
const createProduct = async (product) => {
  return await axios.post(`${API_URL}`, product);
}

const getAllModifiers = () => {
  return axios.get(MODIFIER_URL);
};

const Api = {
    getAllProducts,
    createProduct,
    getAllModifiers
};
export default Api;
