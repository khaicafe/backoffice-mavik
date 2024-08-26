import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import brandService from "../services/brandService";
import supplierService from "../services/supplierService";

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", supplierId: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBrands();
    fetchSuppliers();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await brandService.getBrands();
      setBrands(response.data.brands || []);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      setBrands([]);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await supplierService.getSuppliers();
      setSuppliers(response.data.suppliers || []);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
      setSuppliers([]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues({ name: "", supplierId: "" });
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
        await brandService.updateBrand(editId, formValues);
      } else {
        await brandService.createBrand(formValues);
      }
      fetchBrands();
      handleClose();
    } catch (error) {
      console.error("Failed to save brand:", error);
    }
  };

  const handleEdit = (brand) => {
    setFormValues({ name: brand.name, supplierId: brand.supplierId });
    setEditMode(true);
    setEditId(brand.ID);
    handleOpen();
  };

  const handleDelete = async (id) => {
    try {
      await brandService.deleteBrand(id);
      fetchBrands();
    } catch (error) {
      console.error("Failed to delete brand:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Brands
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Brand
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.ID}>
                <TableCell>{brand.ID}</TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>
                  {
                    suppliers.find(
                      (supplier) => supplier.ID === brand.supplierId
                    )?.name
                  }
                </TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(brand)}>
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(brand.ID)}
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
        <DialogTitle>{editMode ? "Edit Brand" : "Add Brand"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Supplier</InputLabel>
            <Select
              name="supplierId"
              value={formValues.supplierId}
              onChange={handleChange}
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.ID} value={supplier.ID}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
    </Container>
  );
};

export default BrandList;
