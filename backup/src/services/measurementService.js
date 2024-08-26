import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/measurements";

const getMeasurements = () => {
  return axios.get(API_URL);
};

const createMeasurement = (measurement) => {
  return axios.post(API_URL, measurement);
};

const updateMeasurement = (id, measurement) => {
  return axios.put(`${API_URL}/${id}`, measurement);
};

const deleteMeasurement = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getMeasurements,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
};
