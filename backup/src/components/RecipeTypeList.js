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
import recipeTypeService from "../services/recipeTypeService";

const RecipeTypesList = () => {
  const [recipeTypes, setRecipeTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", code: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchRecipeTypes();
  }, []);

  const fetchRecipeTypes = async () => {
    try {
      const response = await recipeTypeService.getRecipeTypes();
      console.log(response)
      setRecipeTypes(response.data.recipeTypes || []);
    } catch (error) {
      console.error("Failed to fetch recipeTypes:", error);
      setRecipeTypes([]);
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
        await recipeTypeService.updateRecipeType(editId, formValues);
      } else {
        await recipeTypeService.createRecipeType(formValues);
      }
      fetchRecipeTypes();
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
      await recipeTypeService.deleteRecipeType(id);
      fetchRecipeTypes();
    } catch (error) {
      console.error("Failed to delete currency:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Recipe Type
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Recipe Type
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipeTypes.map((currency) => (
              <TableRow key={currency.ID}>
                <TableCell>{currency.ID}</TableCell>
                <TableCell>{currency.name}</TableCell>
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
        <DialogTitle>{editMode ? "Edit Recipe Type" : "Add Recipe Type"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formValues.name}
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

export default RecipeTypesList;
