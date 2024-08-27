import axios from "axios";
import config from "../config";

const API_URL = config.apiBaseUrl + "/upload" ;

const uploadimage = {
    // upload image
    uploadimage(data) {
        return axios.post(API_URL, data);
    },

   
};

export default uploadimage;