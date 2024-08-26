import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
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
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import brandService from "../services/brandService";
import currencyService from "../services/currencyService";
import flavourNoteService from "../services/flavourNoteService";
import ingredientService from "../services/ingredientService";
import measurementService from "../services/measurementService";
import supplierService from "../services/supplierService";

const initialFormValues = {
  ID: "",
  name: "",
  description: "",
  supplier_id: "",
  brand_id: "",
  supplier_sku_code: "",
  flavour_note_ids: [],
  organic: false,
  vegan: false,
  price: "",
  currency_type: "",
  measurement_id: "",
  measurement_amount: "",
  total_gram: "",
  yield: "",
  notes: "",
  fat: "",
  sugar: "",
  msnf: "",
  other_solids: "",
  total_solids: "",
  total_water: "",
  cost: "",
  pod: "",
  pac: "",
  gi: "",
  changed_by: "",
};

const IngredientForm = ({
  open,
  handleClose,
  ingredient,
  fetchIngredients,
}) => {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [suppliers, setSuppliers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [flavourNotes, setFlavourNotes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [showPriceHistory, setShowPriceHistory] = useState(false);

  const costPerYield = useMemo(
    () => (formValues.price * 100) / (formValues.total_gram * formValues.yield),
    [formValues.price, formValues.total_gram, formValues.yield]
  );

  const fetchSuppliers = useCallback(async () => {
    const response = await supplierService.getSuppliers();
    setSuppliers(response.data.suppliers);
  }, []);

  const fetchBrands = useCallback(async () => {
    const response = await brandService.getBrands();
    setBrands(response.data.brands);
  }, []);

  const fetchMeasurements = useCallback(async () => {
    const response = await measurementService.getMeasurements();
    setMeasurements(response.data.measurements);
  }, []);

  const fetchFlavourNotes = useCallback(async () => {
    const response = await flavourNoteService.getFlavourNotes();
    setFlavourNotes(response.data.flavourNotes);
  }, []);

  const fetchCurrencies = useCallback(async () => {
    const response = await currencyService.getCurrencies();
    setCurrencies(response.data.currencies);
  }, []);

  const filterBrands = useCallback(
    (supplier_id) => {
      const filtered = brands.filter(
        (brand) => brand.supplier_id === parseInt(supplier_id)
      );
      setFilteredBrands(filtered);
    },
    [brands]
  );

  useEffect(() => {
    fetchSuppliers();
    fetchBrands();
    fetchMeasurements();
    fetchFlavourNotes();
    fetchCurrencies();
  }, [
    fetchSuppliers,
    fetchBrands,
    fetchMeasurements,
    fetchFlavourNotes,
    fetchCurrencies,
  ]);

  useEffect(() => {
    if (open) {
      if (ingredient) {
        setFormValues({
          ID: ingredient.ID || "",
          name: ingredient.name || "",
          description: ingredient.description || "",
          supplier_id: ingredient.supplier_id || "",
          brand_id: ingredient.brand_id || "",
          supplier_sku_code: ingredient.supplier_sku_code || "",
          flavour_note_ids: ingredient.flavour_notes
            ? ingredient.flavour_notes.map((fn) => fn.ID)
            : [],
          organic: ingredient.organic || false,
          vegan: ingredient.vegan || false,
          price: ingredient.price || "",
          currency_type: ingredient.currency_type || "",
          measurement_id: ingredient.measurement_id || "",
          measurement: ingredient.measurement || "",
          measurement_amount: ingredient.measurement_amount || "0",
          total_gram: ingredient.total_gram || "1",
          yield: ingredient.yield || "0",
          notes: ingredient.notes || "",
          fat: ingredient.fat || "",
          sugar: ingredient.sugar || "",
          msnf: ingredient.msnf || "",
          other_solids: ingredient.other_solids || "",
          total_solids: ingredient.total_solids || "",
          total_water: ingredient.total_water || "",
          cost: ingredient.cost || "0",
          pod: ingredient.pod || "",
          pac: ingredient.pac || "",
          gi: ingredient.gi || "",
          changed_by: ingredient.changed_by || "",
        });
        setPriceHistory(ingredient.price_historys || []);
        filterBrands(ingredient.supplier_id);
      } else {
        setFormValues(initialFormValues);
        setPriceHistory([]);
        setFilteredBrands([]);
      }
    } else {
      setFormValues(initialFormValues);
      setPriceHistory([]);
      setFilteredBrands([]);
    }
  }, [open, ingredient, filterBrands]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((formValues) => ({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "supplier_id") {
      filterBrands(value);
      setFormValues((formValues) => ({
        ...formValues,
        brand_id: "",
      }));
    }
  };

  const handleFlavourNotesChange = (event, newValue) => {
    setFormValues({
      ...formValues,
      flavour_note_ids: newValue.map((fn) => fn.ID),
    });
  };

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const handleSave = async () => {
    const dataToSend = {
      ...formValues,
      changed_by: decodedToken.mobile_number,
      price: parseFloat(formValues.price),
      measurement_amount: parseFloat(formValues.measurement_amount),
      total_gram: parseFloat(formValues.total_gram),
      yield: parseFloat(formValues.yield),
      fat: parseFloat(formValues.fat),
      sugar: parseFloat(formValues.sugar),
      msnf: parseFloat(formValues.msnf),
      other_solids: parseFloat(formValues.other_solids),
      total_solids: parseFloat(formValues.total_solids),
      total_water: parseFloat(formValues.total_water),
      cost: parseFloat(formValues.cost),
      pod: parseFloat(formValues.pod),
      pac: parseFloat(formValues.pac),
      gi: parseFloat(formValues.gi),
    };
    console.log(dataToSend);
    if (ingredient) {
      await ingredientService.updateIngredient(ingredient.ID, dataToSend);
    } else {
      await ingredientService.createIngredient(dataToSend);
    }
    fetchIngredients();
    handleClose();
  };

  const handleShowPriceHistory = () => {
    setShowPriceHistory(true);
  };

  const handleClosePriceHistory = () => {
    setShowPriceHistory(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {ingredient ? "Edit Ingredient" : "Add Ingredient"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ingredient name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ingredient Description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="supplier-select-label">Supplier</InputLabel>
              <Select
                labelId="supplier-select-label"
                label="Supplier"
                name="supplier_id"
                value={formValues.supplier_id}
                onChange={handleChange}
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.ID} value={supplier.ID}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Brand</InputLabel>
              <Select
                name="brand_id"
                label="Brand"
                value={formValues.brand_id}
                onChange={handleChange}
              >
                {filteredBrands.map((brand) => (
                  <MenuItem key={brand.ID} value={brand.ID}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Supplier SKU/CODE"
              name="supplier_sku_code"
              value={formValues.supplier_sku_code}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              options={flavourNotes}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              value={flavourNotes.filter((fn) =>
                formValues.flavour_note_ids.includes(fn.ID)
              )}
              onChange={handleFlavourNotesChange}
              renderOption={(props, option, { selected }) => (
                <MenuItem {...props}>
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
                    key={option.ID}
                    label={option.name}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.organic}
                  onChange={handleChange}
                  name="organic"
                />
              }
              label="Organic"
              style={{ marginTop: "8px" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.vegan}
                  onChange={handleChange}
                  name="vegan"
                />
              }
              label="Vegan"
              style={{ marginTop: "8px" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              name="price"
              value={formValues.price}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Currency Type</InputLabel>
              <Select
                name="currency_type"
                label="Currency Type"
                value={formValues.currency_type}
                onChange={handleChange}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.ID} value={currency.code}>
                    {currency.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Measurement Type</InputLabel>
              <Select
                name="measurement_id"
                label="Measurement Type"
                value={formValues.measurement_id}
                onChange={handleChange}
              >
                {measurements.map((measurement) => (
                  <MenuItem key={measurement.ID} value={measurement.ID}>
                    {measurement.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Measurement - Amount"
              name="measurement_amount"
              value={formValues.measurement_amount}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Total Grams"
              name="total_gram"
              value={formValues.total_gram}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Yield %"
              name="yield"
              value={formValues.yield}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Notes"
              name="notes"
              value={formValues.notes}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                backgroundColor: "#f0f0f0",
                padding: 16,
                marginTop: 16,
              }}
            >
              <TextField
                label="Fat"
                name="fat"
                value={formValues.fat}
                onChange={handleChange}
                style={{ flex: "1 0 9%", marginRight: 8, marginBottom: 8 }}
              />
              <TextField
                label="Sugar"
                name="sugar"
                value={formValues.sugar}
                onChange={handleChange}
                style={{ flex: "1 0 9%", marginRight: 8, marginBottom: 8 }}
              />
              <TextField
                label="MSNF"
                name="msnf"
                value={formValues.msnf}
                onChange={handleChange}
                style={{ flex: "1 0 9%", marginRight: 8, marginBottom: 8 }}
              />
              <TextField
                label="Other Solids"
                name="other_solids"
                value={formValues.other_solids}
                onChange={handleChange}
                style={{ flex: "1 0 9%", marginRight: 8, marginBottom: 8 }}
              />
              <TextField
                label="Total Solids"
                name="total_solids"
                value={formValues.total_solids}
                onChange={handleChange}
                style={{ flex: "1 0 9%", marginRight: 8, marginBottom: 8 }}
              />
              <TextField
                label="Total Water"
                name="total_water"
                value={formValues.total_water}
                onChange={handleChange}
                style={{ flex: "1 0 9%", marginRight: 8, marginBottom: 8 }}
              />
              <TextField
                disabled
                label="Cost"
                name="cost"
                value={costPerYield.toFixed(2)}
                onChange={handleChange}
                style={{ flex: "1 0 9%", marginRight: 8, marginBottom: 8 }}
              />
              <TextField
                label="POD"
                name="pod"
                value={formValues.pod}
                onChange={handleChange}
                style={{ flex: "1 0 9%", marginRight: 8, marginBottom: 8 }}
              />
              <TextField
                label="PAC"
                name="pac"
                value={formValues.pac}
                onChange={handleChange}
                style={{ flex: "1 0 9%", marginRight: 8, marginBottom: 8 }}
              />
              <TextField
                label="GI"
                name="gi"
                value={formValues.gi}
                onChange={handleChange}
                style={{ flex: "1 0 9%", marginRight: 8, marginBottom: 8 }}
              />
            </div>
          </Grid>
          {formValues.ID && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleShowPriceHistory}
              >
                Show Price History
              </Button>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          {ingredient ? "Update" : "Save"}
        </Button>
      </DialogActions>
      <Dialog
        open={showPriceHistory}
        onClose={handleClosePriceHistory}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Price Change History</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Old Price</TableCell>
                  <TableCell>New Price</TableCell>
                  <TableCell>Changed By</TableCell>
                  <TableCell>Changed At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {priceHistory.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>{history.old_price}</TableCell>
                    <TableCell>{history.new_price}</TableCell>
                    <TableCell>{history.changed_by}</TableCell>
                    <TableCell>
                      {new Date(history.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePriceHistory} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default IngredientForm;
