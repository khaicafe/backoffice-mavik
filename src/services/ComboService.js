import axios from 'axios';
import config from "../config";

const API_URL = config.apiBaseUrl + "/combos" ;

class ComboService {
  // Lấy danh sách tất cả các combo
  getAllCombos() {
    return axios.get(API_URL);
  }

  // Lấy thông tin combo theo ID
  getComboById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  // Tạo mới combo
  createCombo(comboData) {
    return axios.post(API_URL, comboData);
  }

  // Cập nhật combo theo ID
  updateCombo(id, comboData) {
    return axios.put(`${API_URL}/${id}`, comboData);
  }

  // Xóa combo theo ID
  deleteCombo(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new ComboService();
