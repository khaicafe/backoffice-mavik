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
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import recipeNutritionService from "../services/recipeNutritionRangeService";

const CurrencyList = () => {
  const [recipeNutrition, setRecipeNutrition] = useState([]);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    sugars_min: 0,
    sugars_max: 0,
    fat_min: 0,
    fat_max: 0,
    msnf_min: 0,
    msnf_max: 0,
    other_solids_min: 0,
    other_solids_max: 0,
    total_solids_min: 0,
    total_solids_max: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchrecipeNutrition();
  }, []);

  const fetchrecipeNutrition = async () => {
    try {
      const response = await recipeNutritionService.getAllRecipeNutrition();
      console.log(response.data);
      setRecipeNutrition(response.data.recipeNutrition || []);
    } catch (error) {
      console.error("Failed to fetch recipeNutrition:", error);
      setRecipeNutrition([]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues({
      name: "",
      sugars_min: 0,
      sugars_max: 0,
      fat_min: 0,
      fat_max: 0,
      msnf_min: 0,
      msnf_max: 0,
      other_solids_min: 0,
      other_solids_max: 0,
      total_solids_min: 0,
      total_solids_max: 0,
    });
    setEditMode(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormValues({
      ...formValues,

      [name]: name == "name" ? value : parseFloat(value),
      // fat_max: parseFloat(formValues.fat_max),
      // fat_min: parseFloat(formValues.fat_min),
      // msnf_min: parseFloat(formValues.msnf_min),
      // msnf_max: parseFloat(formValues.msnf_max),
      // other_solids_min: parseFloat(formValues.other_solids_min),
      // other_solids_max: parseFloat(formValues.other_solids_max),
      // sugars_max: parseFloat(formValues.sugars_max),
      // sugars_min: parseFloat(formValues.sugars_min),
      // total_solids_max: parseFloat(formValues.total_solids_max),
      // total_solids_min: parseFloat(formValues.total_solids_min),
    });
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await recipeNutritionService.updateRecipeNutrition(editId, formValues);
      } else {
        await recipeNutritionService.createRecipeNutrition(formValues);
      }
      fetchrecipeNutrition();
      handleClose();
    } catch (error) {
      console.error("Failed to save RecipeNutrition:", error);
    }
  };

  const handleEdit = (recipeNutri) => {
    setFormValues({
      name: recipeNutri.type,
      sugars_min: recipeNutri.sugars_min,
      sugars_max: recipeNutri.sugars_max,
      fat_min: recipeNutri.fat_min,
      fat_max: recipeNutri.fat_max,
      msnf_min: recipeNutri.msnf_min,
      msnf_max: recipeNutri.msnf_max,
      other_solids_min: recipeNutri.other_solids_min,
      other_solids_max: recipeNutri.other_solids_max,
      total_solids_min: recipeNutri.total_solids_min,
      total_solids_max: recipeNutri.total_solids_max,
    });
    setEditMode(true);
    setEditId(recipeNutri.ID);
    handleOpen();
  };

  const handleDelete = async (id) => {
    try {
      await recipeNutritionService.deleteRecipeNutrition(id);
      fetchrecipeNutrition();
    } catch (error) {
      console.error("Failed to delete RecipeNutrition:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        recipeNutrition
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Currency
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2}>ID</TableCell>
              <TableCell rowSpan={2}>Recipe Type</TableCell>
              <TableCell colSpan={2}>Sugars %</TableCell>
              <TableCell colSpan={2}>Fat %</TableCell>
              <TableCell colSpan={2}>MSNF %</TableCell>
              <TableCell colSpan={2}>Other Solids %</TableCell>
              <TableCell colSpan={2}>Total solids %</TableCell>
              <TableCell rowSpan={2}>Actions</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>min</TableCell>
              <TableCell>max</TableCell>
              <TableCell>min</TableCell>
              <TableCell>max</TableCell>
              <TableCell>min</TableCell>
              <TableCell>max</TableCell>
              <TableCell>min</TableCell>
              <TableCell>max</TableCell>
              <TableCell>min</TableCell>
              <TableCell>max</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipeNutrition.map((recipeNutri) => (
              <TableRow key={recipeNutri.ID}>
                <TableCell>{recipeNutri.ID}</TableCell>
                <TableCell>{recipeNutri.type}</TableCell>
                <TableCell>{recipeNutri.sugars_min}</TableCell>
                <TableCell>{recipeNutri.sugars_max}</TableCell>
                <TableCell>{recipeNutri.fat_min}</TableCell>
                <TableCell>{recipeNutri.fat_max}</TableCell>
                <TableCell>{recipeNutri.msnf_min}</TableCell>
                <TableCell>{recipeNutri.msnf_max}</TableCell>
                <TableCell>{recipeNutri.other_solids_min}</TableCell>
                <TableCell>{recipeNutri.other_solids_max}</TableCell>
                <TableCell>{recipeNutri.total_solids_min}</TableCell>
                <TableCell>{recipeNutri.total_solids_max}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleEdit(recipeNutri)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(recipeNutri.ID)}
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
            label="Sugars Min"
            name="sugars_min"
            value={formValues.sugars_min}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Sugars Max"
            name="sugars_max"
            value={formValues.sugars_max}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fat Min"
            name="fat_min"
            value={formValues.fat_min}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fat Max"
            name="fat_max"
            value={formValues.fat_max}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="MSNF Min"
            name="msnf_min"
            value={formValues.msnf_min}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="MSNF Max"
            name="msnf_max"
            value={formValues.msnf_max}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Other Solids Min"
            name="other_solids_min"
            value={formValues.other_solids_min}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Other Solids Max"
            name="other_solids_max"
            value={formValues.other_solids_max}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Total Solids Min"
            name="total_solids_min"
            value={formValues.total_solids_min}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Total Solids Max"
            name="total_solids_max"
            value={formValues.total_solids_max}
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
