import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/temperature" ;
const TemperatureService = {
    // Get all temperatures
    getAllTemperatures() {
        return axios.get(API_URL + "s" );
    },

    // Get a single temperature by ID
    getTemperatureById(id) {
        return axios.get(`${API_URL}/${id}`);
    },

    // Create a new temperature
    createTemperature(temperatureData) {
        return axios.post(API_URL, temperatureData);
    },

    // Update a temperature by ID
    updateTemperature(id, temperatureData) {
        return axios.put(`${API_URL}/${id}`, temperatureData);
    },

    // Delete a temperature by ID
    deleteTemperature(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
};

export default TemperatureService;