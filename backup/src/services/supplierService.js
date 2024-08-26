import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/suppliers";

const getSuppliers = () => {
  return axios.get(API_URL);
};

const createSupplier = (supplier) => {
  return axios.post(API_URL, supplier);
};

const updateSupplier = (id, supplier) => {
  return axios.put(`${API_URL}/${id}`, supplier);
};

const deleteSupplier = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
