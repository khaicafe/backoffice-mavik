import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/category" ;

const CategoryService = {
    // Get all categories
    getAllCategories() {
        return axios.get(config.apiBaseUrl + "/categories" );
    },

    // Get a single category by ID
    getCategoryById(id) {
        return axios.get(`${API_URL}/${id}`);
    },

    // Create a new category
    createCategory(categoryData) {
        return axios.post(API_URL, categoryData);
    },

    // Update a category by ID
    updateCategory(id, categoryData) {
        return axios.put(`${API_URL}/${id}`, categoryData);
    },

    // Delete a category by ID
    deleteCategory(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
};

export default CategoryService;
