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

  // Get a single size by ID
const getProduct = (id) => {
    return axios.get(`${API_URL}/${id}`);
}



const Api = {
    getAllProducts,
    createProduct,
    getProduct,
};
export default Api;
