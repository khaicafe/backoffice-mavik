import axios from 'axios';
import config from "../config";

const API_URL = config.apiBaseUrl + "/menus" ;

class MenuService {
  // Lấy danh sách tất cả các menu
  getAllMenus() {
    return axios.get(API_URL);
  }

  // Lấy thông tin menu theo ID
  getMenuById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  // Tạo mới menu
  createMenu(menuData) {
    return axios.post(API_URL, menuData);
  }

  // Cập nhật menu theo ID
  updateMenu(id, menuData) {
    return axios.put(`${API_URL}/${id}`, menuData);
  }

  // Xóa menu theo ID
  deleteMenu(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new MenuService();
