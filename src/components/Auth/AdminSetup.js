import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import config from "../../config";

const AdminSetup = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSetup = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/setup`, {
        mobile_number: mobileNumber,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error || "Error setting up admin account");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Setup
      </Typography>
      <TextField
        label="Mobile Number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSetup}>
        Setup Admin
      </Button>
      {message && (
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default AdminSetup;
