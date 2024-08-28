import {
    Autocomplete,
    Button,
    Checkbox,
    Container,
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
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import CategoryService from '../../services/CategoryService';
import ComboService from '../../services/ComboService';
import ProductService from '../../services/ProductService';

const Combo = () => {
    const [combos, setCombos] = useState([]);
    const [filteredCombos, setFilteredCombos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openAddComboDialog, setOpenAddComboDialog] = useState(false);
    const [newCombo, setNewCombo] = useState({ name: '', price: 0, categories: [], product_combos: [] });
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [qty, setQty] = useState({});
    const [productPrices, setProductPrices] = useState({});

    useEffect(() => {
        fetchCombos();
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchCombos = async () => {
        const response = await ComboService.getAllCombos();
        setCombos(response.data);
        setFilteredCombos(response.data);
    };

    const fetchProducts = async () => {
        const response = await ProductService.getAllProducts();
        setProducts(response.data || []); // Ensure products is always an array
    };

    const fetchCategories = async () => {
        const response = await CategoryService.getAllCategories();
        console.log(response)
        setCategories(response.data.dataTable || []); // Ensure categories is always an array
    };

    const handleAddCombo = () => {
        setOpenAddComboDialog(true);
    };

    const handleSaveCombo = async () => {
        const comboData = {
            ...newCombo,
            categories: selectedCategories.map(category => ({ category_id: category.ID })),
            product_combos: selectedProducts.map(product => ({
                product_id: product.ID,
                qty: qty[product.ID] || 1,
                price: productPrices[product.ID] || 0,
            })),
        };

        await ComboService.createCombo(comboData);
        fetchCombos();
        setOpenAddComboDialog(false);
        setNewCombo({ name: '', price: 0, categories: [], product_combos: [] });
        setSelectedProducts([]);
        setSelectedCategories([]);
        setQty({});
        setProductPrices({});
    };

    const handleEditCombo = (id) => {
        // Điều hướng đến trang chỉnh sửa combo
        // navigate(`/edit-combo/${id}`);
    };
    
    const handleDeleteCombo = async (id) => {
        try {
            await ComboService.deleteCombo(id);
            setCombos(combos.filter((combo) => combo.ID !== id));
            setFilteredCombos(filteredCombos.filter((combo) => combo.ID !== id));
            toast.success("Combo deleted successfully.");
        } catch (error) {
            console.error("Failed to delete combo:", error);
            toast.error("Failed to delete combo.");
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Combo
            </Typography>

            <Button variant="contained" color="primary" onClick={handleAddCombo}>
                Add Combo
            </Button>

            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCombos.map((combo, index) => (
                            <TableRow key={combo.ID}>
                                <TableCell>{combo.ID}</TableCell>
                                <TableCell>{combo.name}</TableCell>
                                <TableCell>{combo.price}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        onClick={() => handleEditCombo(combo.ID)}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        color="secondary" 
                                        onClick={() => handleDeleteCombo(combo.ID)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openAddComboDialog} onClose={() => setOpenAddComboDialog(false)}>
                <DialogTitle>Add Combo</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={newCombo.name}
                        onChange={(e) => setNewCombo({ ...newCombo, name: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Price"
                        type="number"
                        value={newCombo.price}
                        onChange={(e) => setNewCombo({ ...newCombo, price: parseFloat(e.target.value) })}
                        fullWidth
                        margin="dense"
                    />

                    <Autocomplete
                        multiple
                        options={categories}
                        getOptionLabel={(option) => option.name}
                        value={selectedCategories}
                        onChange={(event, newValue) => setSelectedCategories(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Categories" placeholder="Select Categories" />
                        )}
                        sx={{ marginBottom: 2 }}
                    />

                    <Autocomplete
                        multiple
                        options={products}
                        getOptionLabel={(option) => option.name}
                        value={selectedProducts}
                        isOptionEqualToValue={(option, value) =>
                            // fix warning
                            option.ID === value.ID
                        } // Tùy chỉnh cách so sánh
                        onChange={(event, newValue) => setSelectedProducts(newValue)}
                        renderOption={(props, option) => {
                            const { key, ...otherProps } = props; // Tách key ra khỏi props
                        
                            return (
                                <li key={key} {...otherProps}>
                                    <Checkbox
                                        checked={selectedProducts.some((product) => product.ID === option.ID)}
                                    />
                                    {option.name}
                                    <TextField
                                        label="Qty"
                                        type="number"
                                        value={qty[option.ID] || 1}
                                        onChange={(e) => setQty({ ...qty, [option.ID]: parseInt(e.target.value, 10) })}
                                        sx={{ width: 60, ml: 2 }}
                                    />
                                    <TextField
                                        label="Price"
                                        type="number"
                                        value={productPrices[option.ID] || 0}
                                        onChange={(e) => setProductPrices({ ...productPrices, [option.ID]: parseFloat(e.target.value) })}
                                        sx={{ width: 80, ml: 2 }}
                                    />
                                </li>
                            );
                        }}
                        
                        renderInput={(params) => (
                            <TextField {...params} label="Products" placeholder="Select Products" />
                        )}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddComboDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveCombo} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Combo;
