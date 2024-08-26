import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/recipeNutrition";

const getAllRecipeNutrition = () => {
  return axios.get(API_URL);
};

const createRecipeNutrition = (brand) => {
  return axios.post(API_URL, brand);
};

const updateRecipeNutrition = (id, brand) => {
  return axios.put(API_URL+ "/" + id, brand);
};

const deleteRecipeNutrition = (id) => {
  return axios.delete(API_URL+ "/" + id);
};

export default {
    getAllRecipeNutrition,
    createRecipeNutrition,
    updateRecipeNutrition,
    deleteRecipeNutrition,
};
