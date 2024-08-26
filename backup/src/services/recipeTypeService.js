import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/recipeType";

const getRecipeTypes = () => {
  return axios.get(API_URL);
};

const createRecipeType = (type) => {
  return axios.post(API_URL, type);
};

const updateRecipeType = (id, type) => {
  return axios.put(API_URL+ "/" + id, type);
};

const deleteRecipeType = (id) => {
  return axios.delete(API_URL+ "/" + id);
};

export default {
    getRecipeTypes,
    createRecipeType,
    updateRecipeType,
    deleteRecipeType,
};
