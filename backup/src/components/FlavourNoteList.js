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
import flavourNoteService from "../services/flavourNoteService";

const FlavourNoteList = () => {
  const [flavourNotes, setFlavourNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchFlavourNotes();
  }, []);

  const fetchFlavourNotes = async () => {
    try {
      const response = await flavourNoteService.getFlavourNotes();
      setFlavourNotes(response.data.flavourNotes || []);
    } catch (error) {
      console.error("Failed to fetch flavour notes:", error);
      setFlavourNotes([]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues({ name: "" });
    setEditMode(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSave = async () => {
    if (editMode) {
      await flavourNoteService.updateFlavourNote(editId, formValues);
    } else {
      await flavourNoteService.createFlavourNote(formValues);
    }
    fetchFlavourNotes();
    handleClose();
  };

  const handleEdit = (flavourNote) => {
    setFormValues({ name: flavourNote.name });
    setEditMode(true);
    setEditId(flavourNote.ID);
    handleOpen();
  };

  const handleDelete = async (id) => {
    await flavourNoteService.deleteFlavourNote(id);
    fetchFlavourNotes();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Flavour Notes
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Flavour Note
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
            {flavourNotes.map((flavourNote) => (
              <TableRow key={flavourNote.ID}>
                <TableCell>{flavourNote.ID}</TableCell>
                <TableCell>{flavourNote.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleEdit(flavourNote)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(flavourNote.ID)}
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
          {editMode ? "Edit Flavour Note" : "Add Flavour Note"}
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

export default FlavourNoteList;
