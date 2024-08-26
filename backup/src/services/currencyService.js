import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/currencies";

const getCurrencies = () => {
  return axios.get(API_URL);
};

const createCurrency = (currency) => {
  return axios.post(API_URL, currency);
};

const updateCurrency = (id, currency) => {
  return axios.put(API_URL + "/" + id, currency);
};

const deleteCurrency = (id) => {
  return axios.delete(API_URL+ "/" + id);
};

export default {
  getCurrencies,
  createCurrency,
  updateCurrency,
  deleteCurrency,
};
