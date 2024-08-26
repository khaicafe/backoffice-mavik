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
import measurementService from "../services/measurementService";

const MeasurementList = () => {
  const [measurements, setMeasurements] = useState([]);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    ID: "",
    name: "",
    symbol: "",
    to_gram: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const response = await measurementService.getMeasurements();
      setMeasurements(response.data.measurements || []);
    } catch (error) {
      console.error("Failed to fetch measurements:", error);
      setMeasurements([]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues({ ID: "", name: "", symbol: "", to_gram: "" });
    setEditMode(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSave = async () => {
    try {
      console.log(formValues);
      const dataToSend = {
        ...formValues,
        to_gram: parseFloat(formValues.to_gram),
      };
      console.log(dataToSend);
      if (editMode) {
        await measurementService.updateMeasurement(editId, dataToSend);
      } else {
        await measurementService.createMeasurement(dataToSend);
      }
      fetchMeasurements();
      handleClose();
    } catch (error) {
      console.error("Failed to save measurement:", error);
    }
  };

  const handleEdit = (measurement) => {
    setFormValues({
      ID: measurement.ID || "",
      name: measurement.name || "",
      symbol: measurement.symbol || "",
      to_gram: measurement.to_gram || "",
    });
    setEditMode(true);
    setEditId(measurement.ID);
    handleOpen();
  };

  const handleDelete = async (id) => {
    try {
      await measurementService.deleteMeasurement(id);
      fetchMeasurements();
    } catch (error) {
      console.error("Failed to delete measurement:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Measurements
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Measurement
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>ToGram</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {measurements.map((measurement) => (
              <TableRow key={measurement.ID}>
                <TableCell>{measurement.ID}</TableCell>
                <TableCell>{measurement.name}</TableCell>
                <TableCell>{measurement.symbol}</TableCell>
                <TableCell>{measurement.to_gram}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleEdit(measurement)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(measurement.ID)}
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
        <DialogTitle>
          {editMode ? "Edit Measurement" : "Add Measurement"}
        </DialogTitle>
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
            label="Symbol"
            name="symbol"
            value={formValues.symbol}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ToGram"
            name="to_gram"
            value={formValues.to_gram}
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

export default MeasurementList;
