import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
} from "@mui/material";
import userService from "../../services/userService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userService.getUsers();
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

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
      setSelectedUser(null);
      setRole("");
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.mobile_number}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleUserSelect(user)}
                  >
                    Edit
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
    </Container>
  );
};

export default UserManagement;
