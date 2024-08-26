import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/flavour-notes";

const getFlavourNotes = () => {
  return axios.get(API_URL);
};

const createFlavourNote = (flavourNote) => {
  return axios.post(API_URL, flavourNote);
};

const updateFlavourNote = (id, flavourNote) => {
  return axios.put(`${API_URL}/${id}`, flavourNote);
};

const deleteFlavourNote = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getFlavourNotes,
  createFlavourNote,
  updateFlavourNote,
  deleteFlavourNote,
};
