import axios from "axios";
import config from "../config";
import { parseFields } from '../utils';

const API_URL = config.apiBaseUrl ;

const GroupModifierService = {
    // Get all modifiers
    getAllGroup() {
        return axios.get(API_URL + "/modifierGroups");
    },

    // Get a single modifier by ID
    getGroupModifierById(id) {
        return axios.get(`${API_URL + "/modifierGroups"}/${id}`);
    },

    // Create a new Group
    createGroup(modifierData) {
        return axios.post(API_URL + "/modifierGroups", modifierData);
    },

    // Update a modifier by ID
    updateGroupModifier(id, modifierData) {
        // console.log("Modifier",modifierData);
        return axios.put(`${API_URL + "/group-modifiers"}/${id}`, modifierData);
    },

    // Delete a modifier by ID
    deleteGroupModifier(id) {
        return axios.delete(`${API_URL + "/group-modifiers"}/${id}`);
    },


    createGroupModifier(groupData) {
        // Sử dụng hàm parsePrices để chuyển đổi dữ liệu
        const parsedData = parseFields(groupData);
        return axios.post(`${API_URL}/group-modifiers`, parsedData);
       
    },
    getAllGroupModifiers() {
        return axios.get(API_URL + "/group-modifiers");
    },
};

export default GroupModifierService;
