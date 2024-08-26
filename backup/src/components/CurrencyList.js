import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import currencyService from "../services/currencyService";

const CurrencyList = () => {
  const [currencies, setCurrencies] = useState([]);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", code: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await currencyService.getCurrencies();
      setCurrencies(response.data.currencies || []);
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
      setCurrencies([]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues({ name: "", code: "" });
    setEditMode(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await currencyService.updateCurrency(editId, formValues);
      } else {
        await currencyService.createCurrency(formValues);
      }
      fetchCurrencies();
      handleClose();
    } catch (error) {
      console.error("Failed to save currency:", error);
    }
  };

  const handleEdit = (currency) => {
    setFormValues({ name: currency.name, code: currency.code });
    setEditMode(true);
    setEditId(currency.ID);
    handleOpen();
  };

  const handleDelete = async (id) => {
    try {
      await currencyService.deleteCurrency(id);
      fetchCurrencies();
    } catch (error) {
      console.error("Failed to delete currency:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Currencies
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Currency
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currencies.map((currency) => (
              <TableRow key={currency.ID}>
                <TableCell>{currency.ID}</TableCell>
                <TableCell>{currency.name}</TableCell>
                <TableCell>{currency.code}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleEdit(currency)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(currency.ID)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? "Edit Currency" : "Add Currency"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Code"
            name="code"
            value={formValues.code}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {editMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CurrencyList;
