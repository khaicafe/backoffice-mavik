import axios from "axios";

const API_URL = "http://localhost:8080/api/ingredients";

const getIngredients = () => {
  return axios.get(API_URL);
};

const createIngredient = (data) => {
  return axios.post(API_URL, data);
};

const updateIngredient = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

const deleteIngredient = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
