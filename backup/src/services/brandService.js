import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/brands";

const getBrands = () => {
  return axios.get(API_URL);
};

const createBrand = (brand) => {
  return axios.post(API_URL, brand);
};

const updateBrand = (id, brand) => {
  return axios.put(API_URL+ "/" + id, brand);
};

const deleteBrand = (id) => {
  return axios.delete(API_URL+ "/" + id);
};

export default {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};
