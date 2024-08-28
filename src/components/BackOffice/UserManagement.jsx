import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import productService from "../../services/ProductService";
import userService from "../../services/userService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State cho danh sách người dùng đã lọc
  const [searchTerm, setSearchTerm] = useState(""); // State cho từ khóa tìm kiếm
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", mobile_number: "", role: "user" });
  const [error, setError] = useState("");

  


  useEffect(() => {
    const test = async () => {
      const response = await productService.getAllProducts();
      console.log("Products", response.data);
     // Xử lý dữ liệu để loại bỏ các trường CreatedAt, UpdatedAt, DeletedAt
   
    };
    const fetchUsers = async () => {
      const response = await userService.getUsers();
      console.log("user manager", response.data);
      setUsers(response.data);
      setFilteredUsers(response.data); // Ban đầu hiển thị tất cả người dùng
    };
    fetchUsers();
    test();
  }, []);

  // Hàm để lọc người dùng dựa trên từ khóa tìm kiếm
  useEffect(() => {
    const results = users.filter(user =>
      Object.values(user).some(
        value =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setRole(user.role);
  };

  const handleRoleChange = async () => {
    try {
      
      await userService.updateUserRole(selectedUser.mobile_number, role);
      setUsers(
        users.map((user) =>
          user.mobile_number === selectedUser.mobile_number
            ? { ...user, role }
            : user
        )
      );
      setFilteredUsers(
        filteredUsers.map((user) =>
          user.mobile_number === selectedUser.mobile_number
            ? { ...user, role }
            : user
        )
      );
      setSelectedUser(null);
      setRole("");
      toast.success("User role updated successfully.");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role.");
    }
  };

  const handleAddUser = async () => {
    try {
      setError(""); // Reset lỗi trước khi thêm người dùng
      await userService.createUser(newUser);
      setOpenAddUserDialog(false);

      const response = await userService.getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data); // Cập nhật danh sách đã lọc
      toast.success("User added successfully.");
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error); // Hiển thị thông báo lỗi từ server
      } else {
        toast.error("Error adding user. Please try again.");
      }
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (ID) => {
    try {
      await userService.deleteUser(ID);
      setUsers(users.filter(user => user.ID !== ID));
      setFilteredUsers(filteredUsers.filter(user => user.ID !== ID)); // Cập nhật danh sách đã lọc
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {/* Tạo hàng ngang với nút "Add User" và ô tìm kiếm */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddUserDialog(true)}
        >
          Add User
        </Button>

        {/* TextField cho tìm kiếm */}
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px' }} // Đặt độ rộng cho TextField tìm kiếm
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{index}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.mobile_number}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleUserSelect(user)}
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteUser(user.ID)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedUser && (
        <Container>
          <Typography variant="h6" gutterBottom>
            Edit User
          </Typography>
          <TextField
            label="Mobile Number"
            value={selectedUser.mobile_number}
            fullWidth
            margin="normal"
            disabled
          />
          <Select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRoleChange}
          >
            Save Changes
          </Button>
        </Container>
      )}

      {/* Dialog để thêm người dùng mới */}
      <Dialog
        open={openAddUserDialog}
        onClose={() => setOpenAddUserDialog(false)}
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Mobile Number"
            value={newUser.mobile_number}
            onChange={(e) => setNewUser({ ...newUser, mobile_number: e.target.value })}
            fullWidth
            margin="dense"
          />
          <Select
            label="Role"
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
            fullWidth
            margin="dense"
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </Select>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddUserDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddUser} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
