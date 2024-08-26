import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/recipes";

const getAllRecipes = () => {
  return axios.get(API_URL);
};

const getRecipeById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createRecipe = (recipe) => {
  return axios.post(API_URL, recipe);
};

const updateRecipe = (id, recipe) => {
  return axios.put(`${API_URL}/${id}`, recipe);
};

const deleteRecipe = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
const searchRecipes = (type, flavourNotes) => {
  const params = new URLSearchParams();
  params.append("type", type);
  flavourNotes.forEach((note) => params.append("flavour_notes", note));
  return axios.get(`${API_URL}/search`, { params });
};

export default {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
};
