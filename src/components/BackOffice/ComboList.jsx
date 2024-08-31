import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Grid,
    Modal,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";

import {
    TableCell,
    tableCellClasses
} from "@mui/material";
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import config from '../../config';
import CategoryService from "../../services/CategoryService";
import ComboService from "../../services/ComboService";
import ProductService from "../../services/ProductService";
import { COLORS } from '../../theme/themeColor';
import ImagePicker from '../BaseComponent/ImagePicker';
const BaseUrl = config.BaseUrl

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  

const ComboList = () => {
    const [combos, setCombos] = useState([]);
    const [filteredCombos, setFilteredCombos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [imageURL, setImageURL] = useState('');
    const [selectedCombo, setSelectedCombo] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [comboDetails, setComboDetails] = useState({ name: "", price: 0, products: [], categories: [] });
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [qty, setQty] = useState({});
    const [productPrices, setProductPrices] = useState({});

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: COLORS.BLUE,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
          padding: '0px 5px',
        },
      }));
    
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    // height: 20,
    
    }));
    
    useEffect(() => {
        const fetchCombos = async () => {
            const response = await ComboService.getAllCombos();
            setCombos(response.data);
            setFilteredCombos(response.data);
        };

        fetchCombos();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.getAllProducts();
                setProducts(response.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getAllCategories();
                setCategories(response.data.dataTable || []);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const results = combos.filter((combo) =>
                combo.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCombos(results);
        } else {
            setFilteredCombos(combos);
        }
    }, [searchTerm, combos]);

    // image
    const handleImageSelect = (url) => {
        console.log('Selected URL:', url);
        // formValues.imagelink_square = url;
        setImageURL(url);
        };

    const handleOpenModal = (combo = null) => {
        console.log("Open modal", combo);
        if (combo) {
            // set image
            setImageURL(combo.image_link_square);
            // Fill modal with combo details for editing
            setComboDetails({
                name: combo.name,
                price: combo.price,
                products: combo.product_combos.map(pc => ({
                    product_id: pc.product_id,
                    qty: pc.qty,
                    price: pc.price
                })),
                categories: combo.categories.map(cat => cat.ID)
            });
            setSelectedCombo(combo);
            setSelectedProducts(combo.product_combos.map(pc => ({
                ID: pc.product_id,
                name: pc.Product.name
            })));
            setSelectedCategories(combo.categories.map(cat => ({
                ID: cat.Category.ID,
                name: cat.Category.name
            })));
            setQty(combo.product_combos.reduce((acc, curr) => ({ ...acc, [curr.product_id]: curr.qty }), {}));
            setProductPrices(combo.product_combos.reduce((acc, curr) => ({ ...acc, [curr.product_id]: curr.price }), {}));
        } else {
            // Reset modal for creating new combo
            setComboDetails({ name: "", price: 0, products: [], categories: [] });
            setSelectedProducts([]);
            setSelectedCategories([]);
            setQty({});
            setProductPrices({});
            setSelectedCombo(null);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSaveCombo = async () => {
        try {
            const comboData = {
                name: comboDetails.name,
                price: comboDetails.price,
                image_link_square: imageURL,
                image_link_portrait: imageURL,
                type: "Combo",
                product_combos: selectedProducts.map((product) => ({
                    product_id: product.ID,
                    qty: qty[product.ID] || 1,
                    price: productPrices[product.ID] || 0,
                })),
                categories: selectedCategories.map((category) => ({
                    category_id: category.ID,
                })),
            };

            console.log('comboData', comboData);

            if (selectedCombo) {
                await ComboService.updateCombo(selectedCombo.ID, comboData);
                toast.success("Combo updated successfully.");
            } else {
                await ComboService.createCombo(comboData);
                toast.success("Combo created successfully.");
            }

            setOpenModal(false);
            const response = await ComboService.getAllCombos();
            setCombos(response.data);
            setFilteredCombos(response.data);
        } catch (error) {
            console.error("Failed to save combo:", error);
            toast.error("Failed to save combo.");
        }
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

    const changeCategory = async (value) => {
        console.log("Changing category", value);
        setSelectedCategories(value);
    }

    return (
        <div style={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>
                Combo List
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal()}
            >
                Add Combo
            </Button>

            <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '300px' }} // Đặt độ rộng cho TextField tìm kiếm
            />
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell>Image</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Description</StyledTableCell>
                            <StyledTableCell>Price</StyledTableCell>
                            <StyledTableCell align="right">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCombos.map((combo) => (
                            <StyledTableRow key={combo.ID}>
                                <StyledTableCell>{combo.ID}</StyledTableCell>
                                <StyledTableCell> <img src={BaseUrl + combo.image_link_square} alt={combo.image_link_square} style={{ width: 100 }} /></StyledTableCell>
                                <StyledTableCell>{combo.name}</StyledTableCell>
                                <StyledTableCell>{combo.description}</StyledTableCell>
                                <StyledTableCell>{combo.price}</StyledTableCell>
                                <StyledTableCell align="right">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleOpenModal(combo)}
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
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        {selectedCombo ? "Edit Combo" : "Add Combo"}
                    </Typography>

                    {/* image */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" component="h3" gutterBottom>
                            Combo image
                        </Typography>
                        <ImagePicker onImageSelect={handleImageSelect} defaultImage= {BaseUrl+imageURL}/>
                    </Grid>

                    <TextField
                        label="Combo Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={comboDetails.name}
                        onChange={(e) => setComboDetails({ ...comboDetails, name: e.target.value })}
                    />

                    <TextField
                        label="Price"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={comboDetails.price}
                        onChange={(e) => setComboDetails({ ...comboDetails, price: parseFloat(e.target.value) })}
                    />

                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Autocomplete
                            multiple
                            options={products}
                            value={selectedProducts}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.ID === value.ID}
                            onChange={(event, newValue) => setSelectedProducts(newValue)}
                            renderOption={(props, option) => {
                                const { key, ...otherProps } = props; // Tách key ra khỏi props
                                
                                return (
                                    <li {...otherProps} key={key}>
                                        <Checkbox
                                            checked={selectedProducts.some((product) => product.ID === option.ID)}
                                        />
                                        {option.name}
                                        
                                    </li>
                                );
                            }}
                            
                            renderInput={(params) => (
                                <TextField {...params} label="Select Products" placeholder="Select products" />
                            )}
                        />
                        
                    )}
                     {selectedProducts.length > 0 && (
                        <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 300 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Qty</TableCell>
                                        <TableCell>Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedProducts.map((product) => (
                                        <TableRow key={product.ID}>
                                            <TableCell>{product.ID}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    value={qty[product.ID] || 1}
                                                    onChange={(e) => setQty({ ...qty, [product.ID]: parseInt(e.target.value, 10) })}
                                                    sx={{ width: 60 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    value={productPrices[product.ID] || 0}
                                                    onChange={(e) => setProductPrices({ ...productPrices, [product.ID]: parseFloat(e.target.value) })}
                                                    sx={{ width: 80 }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    <Autocomplete
                        multiple
                        options={categories}
                        value={selectedCategories}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.ID === value.ID}
                        onChange={(event, newValue) => changeCategory(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Select Categories" placeholder="Select categories" />
                        )}
                        sx={{ marginTop: 2 }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveCombo}
                        sx={{ marginTop: 2 }}
                    >
                        {selectedCombo ? "Save Changes" : "Create Combo"}
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default ComboList;
