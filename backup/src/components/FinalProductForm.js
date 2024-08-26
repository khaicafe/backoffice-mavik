import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import finalProductService from "../services/finalProductService";
import recipeService from "../services/recipeService";

const FinalProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const recipeId = parseInt(queryParams.get("recipeId"));
  const isEditing = Boolean(id);

  const initialFormState = {
    recipe_id: "",
    quantity: "",
    unit: "metric",
    notes: "",
    steps: [], // Initialize as an empty array
    comments: [], // Initialize as an empty array
  };

  const [formValues, setFormValues] = useState(initialFormState);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [originIngredients, setOriginIngredients] = useState([]);

  const totalQuantityRef = useRef(0);
  const totalOriginalQuantityRef = useRef(0);

  useEffect(() => {
    fetchRecipes();

    if (isEditing) {
      fetchFinalProduct();
    }
    if (recipeId) {
      fetchRecipeDetails(recipeId);
    }

    console.log("useEffect");
  }, [isEditing, recipeId]);

  const fetchRecipes = async () => {
    const response = await recipeService.getAllRecipes();
    setRecipes(response.data.recipes || []);
    // Set the recipe_id only if it matches an available option
    const recipeIdExists = response.data.recipes.some(
      (recipe) => recipe.ID === recipeId
    );

    setFormValues((prevValues) => ({
      ...prevValues,
      recipe_id: recipeIdExists ? recipeId : "",
    }));
  };

  const fetchFinalProduct = async () => {
    const response = await finalProductService.getFinalProduct(id);
    const finalProduct = response.data.data;

    setFormValues({
      ...finalProduct,
      steps: finalProduct.steps || [], // Ensure steps is an array
      comments: finalProduct.comments || [], // Ensure comments is an array
    });
  };

  const fetchRecipeDetails = async (recipeId) => {
    const response = await recipeService.getRecipeById(recipeId);
    const recipe = response.data.recipe;
    setSelectedRecipe(recipe);

    if (recipe && recipe.recipe_ingredients) {
      setOriginIngredients(recipe.recipe_ingredients);

      const sum = recipe.recipe_ingredients.reduce(
        (result, item) => result + item.quantity * item.ingredient.total_gram,
        0
      );

      totalOriginalQuantityRef.current = sum;
      totalQuantityRef.current = sum;

      setFormValues((prevState) => ({
        ...prevState,
        quantity: sum,
      }));
    }
  };

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      if (name === "quantity" && totalOriginalQuantityRef.current) {
        const rate = value / totalOriginalQuantityRef.current;

        setSelectedRecipe((prevState) => ({
          ...prevState,
          recipe_ingredients: prevState.recipe_ingredients.map((ri, i) => ({
            ...ri,
            quantity: originIngredients[i].quantity * rate,
          })),
        }));
      }
    },
    [originIngredients]
  );

  const handleStepChange = (index, value) => {
    const newSteps = formValues.steps.map((step, i) =>
      i === index ? { ...step, description: value } : step
    );
    setFormValues({ ...formValues, steps: newSteps });
  };

  const handleAddStep = () => {
    setFormValues((prevState) => ({
      ...prevState,
      steps: [
        ...prevState.steps,
        { description: "", order: prevState.steps.length + 1 },
      ],
    }));
  };

  const handleRemoveStep = (index) => {
    setFormValues((prevState) => ({
      ...prevState,
      steps: prevState.steps.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (isEditing) {
      await finalProductService.updateFinalProduct(id, formValues);
    } else {
      await finalProductService.createFinalProduct(formValues);
    }
    navigate("/final-products");
  };

  console.log("render formValues", formValues);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper style={{ padding: "20px" }}>
          <Typography variant="h5">
            {isEditing ? "Edit Final Product" : "Create Final Product"}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Recipe</InputLabel>
            <Select
              name="recipe_id"
              value={formValues.recipe_id}
              label="Recipe"
              disabled={true}
            >
              {recipes.map((recipe) => (
                <MenuItem key={recipe.ID} value={recipe.ID}>
                  {recipe.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="quantity"
            label="Quantity(Grams)"
            value={formValues.quantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Unit</InputLabel>
            <Select
              name="unit"
              value={formValues.unit}
              onChange={handleChange}
              label="Unit"
            >
              <MenuItem value="metric">Metric</MenuItem>
              <MenuItem value="imperial">Imperial</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="notes"
            label="Notes"
            value={formValues.notes}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
          />
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Steps
          </Typography>
          {formValues.steps.map((step, index) => (
            <Grid container spacing={2} key={index} alignItems="center">
              <Grid item xs={10}>
                <TextField
                  label={`Step ${index + 1}`}
                  value={step.description}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  color="secondary"
                  onClick={() => handleRemoveStep(index)}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button color="primary" onClick={handleAddStep}>
            Add Step
          </Button>

          {/* Display Recipe Details */}
          {selectedRecipe && (
            <>
              <Typography variant="h6" style={{ marginTop: "20px" }}>
                Recipe Details
              </Typography>
              <Typography variant="body1">
                <strong>Flavour:</strong> {selectedRecipe.flavour}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {selectedRecipe.description}
              </Typography>
              <Typography variant="body1">
                <strong>Location Made:</strong> {selectedRecipe.location_made}
              </Typography>
              <Typography variant="body1">
                <strong>Overrun:</strong> {selectedRecipe.overrun}%
              </Typography>
              <Typography variant="body1">
                <strong>Amount to Make:</strong> {selectedRecipe.amount_to_make}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {selectedRecipe.date}
              </Typography>

              {/* Display Ingredients */}
              <Typography variant="h6" style={{ marginTop: "20px" }}>
                Ingredients
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ingredient</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Measurement Type</TableCell>
                      <TableCell>Quantity(Grams)</TableCell>
                      <TableCell>Measurement Type</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRecipe.recipe_ingredients.map((ri, index) => (
                      <TableRow key={index}>
                        <TableCell>{ri.ingredient.name}</TableCell>
                        <TableCell>{ri.ingredient.brand?.name}</TableCell>
                        <TableCell>{ri.ingredient.supplier?.name}</TableCell>
                        <TableCell>{ri.quantity.toFixed(2)}</TableCell>
                        <TableCell>{ri.ingredient.measurement.name}</TableCell>
                        <TableCell>
                          {(ri.quantity * ri.ingredient.total_gram).toFixed(2)}
                        </TableCell>
                        <TableCell>{"Grams"}</TableCell>
                        <TableCell>
                          {(
                            ri.ingredient.price *
                            ri.quantity *
                            ri.ingredient.total_gram
                          ).toFixed(2)}{" "}
                          {ri.ingredient.currency_type}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Grid
            container
            justifyContent="flex-end"
            style={{ marginTop: "20px" }}
          >
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {isEditing ? "Update" : "Save"}
            </Button>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FinalProductForm;
