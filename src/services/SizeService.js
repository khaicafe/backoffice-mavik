import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/size" ;

const SizeService = {
    // Get all sizes
    getAllSizes() {
        return axios.get(API_URL + "s");
    },

    // Get a single size by ID
    getSizeById(id) {
        return axios.get(`${API_URL}/${id}`);
    },

    // Create a new size
    createSize(sizeData) {
        return axios.post(API_URL, sizeData);
    },

    // Update a size by ID
    updateSize(id, sizeData) {
        return axios.put(`${API_URL}/${id}`, sizeData);
    },

    // Delete a size by ID
    deleteSize(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
};

export default SizeService;
