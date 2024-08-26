import axios from "axios";

const API_URL = "http://localhost:8080/api";

const createFinalProduct = (data) => {
  return axios.post(`${API_URL}/final_products`, data);
};

const getFinalProducts = () => {
  return axios.get(`${API_URL}/final_products`);
};

const getFinalProduct = (id) => {
  return axios.get(`${API_URL}/final_products/${id}`);
};

const updateFinalProduct = (id, data) => {
  return axios.put(`${API_URL}/final_products/${id}`, data);
};

const deleteFinalProduct = (id) => {
  return axios.delete(`${API_URL}/final_products/${id}`);
};

export default {
  createFinalProduct,
  getFinalProducts,
  getFinalProduct,
  updateFinalProduct,
  deleteFinalProduct,
};
