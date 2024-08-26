import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Chip,
  Typography,
} from "@mui/material";
import recipeService from "../services/recipeService";
import flavourNoteService from "../services/flavourNoteService";
import recipeTypeService from "../services/recipeTypeService";

const RecipeSearch = () => {
  const [recipes, setRecipes] = useState([]);
  const [recipeTypes, setRecipeTypes] = useState([]);
  const [flavourNotes, setFlavourNotes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedFlavourNotes, setSelectedFlavourNotes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    fetchRecipeTypes();
    fetchFlavourNotes();
  }, []);
  const navigate = useNavigate();
  const fetchRecipeTypes = async () => {
    try {
      const response = await recipeTypeService.getRecipeTypes();
      setRecipeTypes(response.data.recipeTypes || []);
    } catch (error) {
      console.error("Failed to fetch recipeTypes:", error);
      setRecipeTypes([]);
    }
  };

  const fetchFlavourNotes = async () => {
    const response = await flavourNoteService.getFlavourNotes();
    setFlavourNotes(response.data.flavourNotes);
  };

  const handleSearch = async () => {
    const response = await recipeService.searchRecipes(
      selectedType,
      selectedFlavourNotes
    );
    setRecipes(response.data.data);
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmMakeProduct = () => {
    // Handle the logic to start making the final product from the recipe
    //console.log("Making product from recipe:", selectedRecipe);
    //setOpenDialog(false);

    navigate(`/final-product-form/?recipeId=${selectedRecipe.ID}`);
  };

  return (
    <div>
      <Grid container spacing={3} style={{ marginBottom: "20px" }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {recipeTypes.map((type) => (
                <MenuItem key={type.ID} value={type.ID}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Flavour Notes</InputLabel>
            <Select
              multiple
              value={selectedFlavourNotes}
              onChange={(e) => setSelectedFlavourNotes(e.target.value)}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={
                        flavourNotes.find((note) => note.ID === value)?.name
                      }
                    />
                  ))}
                </div>
              )}
            >
              {flavourNotes.map((note) => (
                <MenuItem key={note.ID} value={note.ID}>
                  {note.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Flavour Notes</TableCell>
              <TableCell>Flavour</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location Made</TableCell>
              <TableCell>Overrun %</TableCell>
              <TableCell>Amount to Make</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Ingredients</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.map((recipe, index) => (
              <TableRow
                key={index}
                onClick={() => handleSelectRecipe(recipe)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{recipe.recipe_type.name}</TableCell>
                <TableCell>
                  {recipe.flavour_notes.map((note) => note.name).join(", ")}
                </TableCell>
                <TableCell>{recipe.flavour}</TableCell>
                <TableCell>{recipe.description}</TableCell>
                <TableCell>{recipe.location_made}</TableCell>
                <TableCell>{recipe.overrun}</TableCell>
                <TableCell>{recipe.amount_to_make}</TableCell>
                <TableCell>{recipe.date}</TableCell>
                <TableCell>
                  {recipe.recipe_ingredients.map((ri, index) => (
                    <Typography key={index}>
                      {ri.ingredient.name} - {ri.quantity}
                    </Typography>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to make the final product from the recipe "
            {selectedRecipe?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmMakeProduct} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RecipeSearch;
