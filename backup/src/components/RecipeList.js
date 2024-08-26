import {
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Autocomplete,
  Checkbox,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import flavourNoteService from "../services/flavourNoteService";
import recipeService from "../services/recipeService";
import recipeTypeService from "../services/recipeTypeService";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [recipeTypes, setRecipeTypes] = useState([]);
  const [typeSearch, setTypeSearch] = useState("");
  const [flavourNotes, setFlavourNotes] = useState([]);
  const [availableFlavourNotes, setAvailableFlavourNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
    fetchFlavourNotes();
    fetchRecipeTypes();
  }, []);

  const fetchRecipes = async () => {
    const response = await recipeService.getAllRecipes();
    setRecipes(response.data.recipes || []);
    setFilteredRecipes(response.data.recipes || []);
  };

  const fetchFlavourNotes = async () => {
    const response = await flavourNoteService.getFlavourNotes();
    setAvailableFlavourNotes(response.data.flavourNotes || []);
  };

  const fetchRecipeTypes = async () => {
    try {
      const response = await recipeTypeService.getRecipeTypes();
      setRecipeTypes(response.data.recipeTypes || []);
    } catch (error) {
      console.error("Failed to fetch recipeTypes:", error);
      setRecipeTypes([]);
    }
  };

  const handleSearch = () => {
    let filtered = recipes;

    // Apply type filter
    if (typeSearch) {
      filtered = filtered.filter((recipe) => recipe.type === typeSearch);
    }

    // Apply flavour notes filter
    if (flavourNotes.length > 0) {
      filtered = filtered.filter((recipe) => {
        return (
          recipe.flavourNotes &&
          recipe.flavourNotes.some((note) => flavourNotes.includes(note.ID))
        );
      });
    }

    // No need to check for empty filters; the logic naturally handles it
    setFilteredRecipes(filtered);
  };

  const handleEdit = (id) => {
    navigate(`/recipe-form/${id}`);
  };

  const handleDelete = async (id) => {
    await recipeService.deleteRecipe(id);
    setRecipes(recipes.filter((recipe) => recipe.ID !== id));
    setFilteredRecipes(filteredRecipes.filter((recipe) => recipe.ID !== id));
  };

  const handleFlavourNotesChange = (event, newValue) => {
    setFlavourNotes((prevState) => ({
      ...newValue,
    }));
    console.log(flavourNotes);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Recipes
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/recipe-form")}
      >
        Add Recipe
      </Button>
      <FormControl fullWidth margin="normal">
        <InputLabel>Type Search</InputLabel>
        <Select
          value={typeSearch}
          onChange={(e) => setTypeSearch(e.target.value)}
          input={<OutlinedInput label="Type Search" />}
        >
          {recipeTypes.map((type) => (
            <MenuItem key={type.ID} value={type.ID}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <FormControl fullWidth margin="normal">
        <InputLabel>Flavour Notes</InputLabel>
        <Select
          multiple
          value={flavourNotes}
          onChange={(e) => setFlavourNotes(e.target.value)}
          input={<OutlinedInput label="Flavour Notes" />}
          renderValue={(selected) => (
            <div>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={
                    availableFlavourNotes.find((note) => note.ID === value)
                      ?.name
                  }
                />
              ))}
            </div>
          )}
        >
          {availableFlavourNotes.map((note) => (
            <MenuItem key={note.ID} value={note.ID}>
              {note.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      <FormControl fullWidth margin="normal">
        <Autocomplete
          multiple
          options={availableFlavourNotes}
          getOptionLabel={(option) => option.name}
          onChange={handleFlavourNotesChange}
          renderOption={(props, option, { selected }) => (
            <MenuItem {...props} key={option.ID}>
              <Checkbox checked={selected} style={{ marginRight: 8 }} />
              {option.name}
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Flavour Notes" margin="dense" />
          )}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                key={option}
                label={option.name}
                {...getTagProps({ index })}
              />
            ))
          }
        />
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Flavour Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecipes.map((recipe) => (
              <TableRow key={recipe.ID}>
                <TableCell>{recipe.ID}</TableCell>
                <TableCell>{recipe.name}</TableCell>
                <TableCell>{recipe.recipe_type.name}</TableCell>
                <TableCell>
                  {recipe.flavour_notes
                    ? recipe.flavour_notes.map((note) => note.name).join(", ")
                    : ""}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleEdit(recipe.ID)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(recipe.ID)}
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
    </Container>
  );
};

export default RecipeList;
