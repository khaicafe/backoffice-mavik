import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/products";

const getAllProducts = () => {
  return axios.get(`${API_URL}`);
};
const createProduct = async (product) => {
  return await axios.post(`${API_URL}`, product);
}

  // Get a single Product by ID
const getProduct = (id) => {
    return axios.get(`${API_URL}/${id}`);
}
 // Update a Product by ID
 const updateProduct = (id, Product) => {
  return axios.put(`${API_URL}/${id}`, Product);
}

// Delete a Product by IDd
const deleteProduct = (id) => {
  return axios.delete(`${API_URL}/${id}`);
}



const Api = {
    getAllProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
};
export default Api;
