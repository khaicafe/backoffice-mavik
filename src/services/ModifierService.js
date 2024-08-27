import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl ;

const ModifierService = {
    // Get all modifiers
    getAllModifiers() {
        return axios.get(API_URL + "/modifiers");
    },

    // Get a single modifier by ID
    getModifierById(id) {
        return axios.get(`${API_URL + "/modifier"}/${id}`);
    },

    // Create a new modifier
    createModifier(modifierData) {
        return axios.post(API_URL + "/modifier", modifierData);
    },

    // Update a modifier by ID
    updateModifier(id, modifierData) {
        console.log("Modifier",modifierData);
        return axios.put(`${API_URL + "/modifier"}/${id}`, modifierData);
    },

    // Delete a modifier by ID
    deleteModifier(id) {
        return axios.delete(`${API_URL + "/modifier"}/${id}`);
    }
};

export default ModifierService;
