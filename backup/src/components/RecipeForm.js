import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import ingredientService from "../services/ingredientService";
import recipeTypeService from "../services/recipeTypeService";
import recipeService from "../services/recipeService";
import recipeNutritionRangeService from "../services/recipeNutritionRangeService";
import flavourNoteService from "../services/flavourNoteService";

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialFormValues = {
    name: "",
    recipe_type_id: "",
    flavour_notes: [],
    location_made: "",
    overrun: "",
    flavour: "",
    description: "",
    amount_to_make: "",
    date: new Date().toISOString().split("T")[0], // Set default date to today
    ingredients: [],
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipeTypes, setRecipeTypes] = useState([]);
  const [flavourNotes, setFlavourNotes] = useState([]);
  const [nutritionRange, setNutritionRange] = useState(null);

  useEffect(() => {
    fetchIngredients();
    fetchRecipeTypes();
    fetchFlavourNotes();

    if (id) {
      fetchRecipe(id);
    }

    fetchNutritionRange(); // Fetch nutrition range data
  }, [id]);

  const fetchRecipe = async (recipeId) => {
    const response = await recipeService.getRecipeById(recipeId);
    const recipe = response.data.recipe;

    const selected = recipe.recipe_ingredients.map((ri) => ({
      ...ri.ingredient,
      quantity: ri.quantity,
      variegate: ri.variegate,
    }));

    setSelectedIngredients(selected);

    setFormValues({
      name: recipe.name,
      recipe_type_id: recipe.recipe_type_id,
      flavour_notes: recipe.flavour_notes.map((fn) => fn.ID),
      location_made: recipe.location_made,
      overrun: recipe.overrun,
      flavour: recipe.flavour,
      description: recipe.description,
      amount_to_make: recipe.amount_to_make,
      date: recipe.date || new Date().toISOString().split("T")[0],
      ingredients: selected.map((ing) => ({
        id: ing.ID,
        quantity: ing.quantity,
        variegate: ing.variegate,
      })),
    });
  };

  const fetchNutritionRange = async () => {
    try {
      const response =
        await recipeNutritionRangeService.getAllRecipeNutrition();
      console.log(response.data.recipeNutrition[0]);
      setNutritionRange(response.data.recipeNutrition[0] || null);
    } catch (error) {
      console.error("Failed to fetch nutrition range:", error);
      setNutritionRange(null);
    }
  };

  const fetchFlavourNotes = async () => {
    const response = await flavourNoteService.getFlavourNotes();
    setFlavourNotes(response.data.flavourNotes || []);
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

  const fetchIngredients = async () => {
    try {
      const response = await ingredientService.getIngredients();
      setIngredients(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch ingredients:", error);
      setIngredients([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleIngredientSelect = (event, value) => {
    if (value) {
      const duplicateItem = selectedIngredients.find(
        (ing) => ing.ID === value.ID
      );
      if (!duplicateItem) {
        setSelectedIngredients([
          ...selectedIngredients,
          { ...value, quantity: 1, variegate: false },
        ]);
        setFormValues((prevState) => ({
          ...prevState,
          ingredients: [
            ...prevState.ingredients,
            { ID: value.ID, quantity: 1, variegate: false },
          ],
        }));
        return;
      }
      setSelectedIngredients([
        ...selectedIngredients,
        { ...value, quantity: 1, variegate: !duplicateItem.variegate },
      ]);
      setFormValues((prevState) => ({
        ...prevState,
        ingredients: [
          ...prevState.ingredients,
          { ID: value.ID, quantity: 1, variegate: !duplicateItem.variegate },
        ],
      }));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    if (
      selectedIngredients.find(
        (ing) =>
          ing.ID === selectedIngredients[index].ID &&
          field === "variegate" &&
          ing.variegate === value
      )
    ) {
      alert("Ingredient already added with the same variegate value");
      return;
    }
    const newRecipeIngredients = formValues.ingredients.map((ri, i) =>
      i === index ? { ...ri, [field]: value } : ri
    );
    setFormValues({ ...formValues, ingredients: newRecipeIngredients });
    setSelectedIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  };

  const handleRemoveIngredient = (index) => {
    setSelectedIngredients(selectedIngredients.filter((ing, i) => i !== index));
    setFormValues((prevState) => ({
      ...prevState,
      ingredients: prevState.ingredients.filter((ing, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    const dataToSend = {
      ...formValues,
      ingredients: selectedIngredients.map((ing) => ({
        id: ing.ID,
        quantity: parseFloat(ing.quantity),
        variegate: ing.variegate,
      })),
    };

    if (id) {
      await recipeService.updateRecipe(id, dataToSend);
    } else {
      await recipeService.createRecipe(dataToSend);
    }
    navigate("/recipes");
  };

  const calculateTotals = (field) => {
    return selectedIngredients.reduce(
      (total, ingredient) => total + ingredient[field] * ingredient.quantity,
      0
    );
  };

  const totalFat = calculateTotals("fat");
  const totalSugar = calculateTotals("sugar");
  const totalMSNF = calculateTotals("msnf");
  const totalOtherSolids = calculateTotals("other_solids");
  const totalTotalSolids = calculateTotals("total_solids");
  const totalTotalWater = calculateTotals("total_water");
  const totalPOD = calculateTotals("pod");
  const totalPAC = calculateTotals("pac");
  const totalGI = calculateTotals("gi");

  const grandTotal =
    totalFat +
    totalSugar +
    totalMSNF +
    totalOtherSolids +
    totalTotalSolids +
    totalTotalWater +
    totalPOD +
    totalPAC +
    totalGI;

  const calculatePercentageOfTotal = (value) => {
    return grandTotal > 0 ? ((value / grandTotal) * 100).toFixed(2) : "0.00";
  };

  const isInRange = (value, min, max) => {
    return value >= min && value <= max;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Recipe Name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            name="recipe_type_id"
            value={formValues.recipe_type_id}
            onChange={handleChange}
            input={<OutlinedInput label="Type" />}
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
            name="flavour_notes"
            value={formValues.flavour_notes}
            onChange={handleChange}
            input={<OutlinedInput label="Flavour Notes" />}
            renderValue={(selected) =>
              selected
                .map((id) => {
                  const flavourNote = flavourNotes.find((fn) => fn.ID === id);
                  return flavourNote ? flavourNote.name : "";
                })
                .join(", ")
            }
          >
            {flavourNotes.map((flavourNote) => (
              <MenuItem key={flavourNote.ID} value={flavourNote.ID}>
                <Checkbox
                  checked={
                    formValues.flavour_notes.indexOf(flavourNote.ID) > -1
                  }
                />
                <ListItemText primary={flavourNote.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Location Made"
          name="location_made"
          value={formValues.location_made}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Overrun %"
          name="overrun"
          type="number"
          value={formValues.overrun}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Flavour"
          name="flavour"
          value={formValues.flavour}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Description"
          name="description"
          value={formValues.description}
          onChange={handleChange}
          fullWidth
          multiline
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Amount to Make"
          name="amount_to_make"
          type="number"
          value={formValues.amount_to_make}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formValues.date}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          options={ingredients}
          getOptionLabel={(option) => option.name || ""}
          onChange={handleIngredientSelect}
          renderInput={(params) => (
            <TextField {...params} label="Add Ingredient" />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Fat</TableCell>
                <TableCell>Sugar</TableCell>
                <TableCell>MSNF</TableCell>
                <TableCell>Other Solids</TableCell>
                <TableCell>Total Solids</TableCell>
                <TableCell>Total Water</TableCell>
                <TableCell>POD</TableCell>
                <TableCell>PAC</TableCell>
                <TableCell>GI</TableCell>
                <TableCell>Variegate</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedIngredients.map((ingredient, index) => (
                <TableRow key={index}>
                  <TableCell>{ingredient.name}</TableCell>
                  <TableCell>{ingredient.supplier_id}</TableCell>
                  <TableCell>{ingredient.brand_id}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      inputProps={{ min: "0", step: "0.01" }}
                    />
                  </TableCell>
                  <TableCell>{ingredient.fat}</TableCell>
                  <TableCell>{ingredient.sugar}</TableCell>
                  <TableCell>{ingredient.msnf}</TableCell>
                  <TableCell>{ingredient.other_solids}</TableCell>
                  <TableCell>{ingredient.total_solids}</TableCell>
                  <TableCell>{ingredient.total_water}</TableCell>
                  <TableCell>{ingredient.pod}</TableCell>
                  <TableCell>{ingredient.pac}</TableCell>
                  <TableCell>{ingredient.gi}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={ingredient.variegate}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "variegate",
                          e.target.checked
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRemoveIngredient(index)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {/* Total Row */}
              <TableRow>
                <TableCell colSpan={4}>Total</TableCell>
                <TableCell>{totalFat}</TableCell>
                <TableCell>{totalSugar}</TableCell>
                <TableCell>{totalMSNF}</TableCell>
                <TableCell>{totalOtherSolids}</TableCell>
                <TableCell>{totalTotalSolids}</TableCell>
                <TableCell>{totalTotalWater}</TableCell>
                <TableCell>{totalPOD}</TableCell>
                <TableCell>{totalPAC}</TableCell>
                <TableCell>{totalGI}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              {/* Percentage of Grand Total Row */}
              <TableRow>
                <TableCell colSpan={4}>Percentage of Grand Total</TableCell>
                <TableCell
                  style={{
                    backgroundColor: nutritionRange
                      ? isInRange(
                          calculatePercentageOfTotal(totalFat),
                          nutritionRange.fat_min,
                          nutritionRange.fat_max
                        )
                        ? "green"
                        : "red"
                      : "transparent",
                  }}
                >
                  {calculatePercentageOfTotal(totalFat)}%
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: nutritionRange
                      ? isInRange(
                          calculatePercentageOfTotal(totalSugar),
                          nutritionRange.sugars_min,
                          nutritionRange.sugars_max
                        )
                        ? "green"
                        : "red"
                      : "transparent",
                  }}
                >
                  {calculatePercentageOfTotal(totalSugar)}%
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: nutritionRange
                      ? isInRange(
                          calculatePercentageOfTotal(totalMSNF),
                          nutritionRange.msnf_min,
                          nutritionRange.msnf_max
                        )
                        ? "green"
                        : "red"
                      : "transparent",
                  }}
                >
                  {calculatePercentageOfTotal(totalMSNF)}%
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: nutritionRange
                      ? isInRange(
                          calculatePercentageOfTotal(totalOtherSolids),
                          nutritionRange.other_solids_min,
                          nutritionRange.other_solids_max
                        )
                        ? "green"
                        : "red"
                      : "transparent",
                  }}
                >
                  {calculatePercentageOfTotal(totalOtherSolids)}%
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: nutritionRange
                      ? isInRange(
                          calculatePercentageOfTotal(totalTotalSolids),
                          nutritionRange.total_solids_min,
                          nutritionRange.total_solids_max
                        )
                        ? "green"
                        : "red"
                      : "transparent",
                  }}
                >
                  {calculatePercentageOfTotal(totalTotalSolids)}%
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: nutritionRange
                      ? isInRange(
                          calculatePercentageOfTotal(totalTotalWater),
                          nutritionRange.total_water_min,
                          nutritionRange.total_water_max
                        )
                        ? "green"
                        : "red"
                      : "transparent",
                  }}
                >
                  {calculatePercentageOfTotal(totalTotalWater)}%
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: nutritionRange
                      ? isInRange(
                          calculatePercentageOfTotal(totalPOD),
                          nutritionRange.pod_min,
                          nutritionRange.pod_max
                        )
                        ? "green"
                        : "red"
                      : "transparent",
                  }}
                >
                  {calculatePercentageOfTotal(totalPOD)}%
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: nutritionRange
                      ? isInRange(
                          calculatePercentageOfTotal(totalPAC),
                          nutritionRange.pac_min,
                          nutritionRange.pac_max
                        )
                        ? "green"
                        : "red"
                      : "transparent",
                  }}
                >
                  {calculatePercentageOfTotal(totalPAC)}%
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: nutritionRange
                      ? isInRange(
                          calculatePercentageOfTotal(totalGI),
                          nutritionRange.gi_min,
                          nutritionRange.gi_max
                        )
                        ? "green"
                        : "red"
                      : "transparent",
                  }}
                >
                  {calculatePercentageOfTotal(totalGI)}%
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              {/* Nutrition Range Row */}
              {nutritionRange && (
                <TableRow>
                  <TableCell colSpan={4}>Nutrition Range</TableCell>
                  <TableCell>{`${nutritionRange.fat_min}% - ${nutritionRange.fat_max}%`}</TableCell>
                  <TableCell>{`${nutritionRange.sugars_min}% - ${nutritionRange.sugars_max}%`}</TableCell>
                  <TableCell>{`${nutritionRange.msnf_min}% - ${nutritionRange.msnf_max}%`}</TableCell>
                  <TableCell>{`${nutritionRange.other_solids_min}% - ${nutritionRange.other_solids_max}%`}</TableCell>
                  <TableCell>{`${nutritionRange.total_solids_min}% - ${nutritionRange.total_solids_max}%`}</TableCell>
                  <TableCell>{`${nutritionRange.total_water_min}% - ${nutritionRange.total_water_max}%`}</TableCell>
                  <TableCell>{`${nutritionRange.pod_min} - ${nutritionRange.pod_max}`}</TableCell>
                  <TableCell>{`${nutritionRange.pac_min} - ${nutritionRange.pac_max}`}</TableCell>
                  <TableCell>{`${nutritionRange.gi_min} - ${nutritionRange.gi_max}`}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          {id ? "Update" : "Save"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default RecipeForm;
