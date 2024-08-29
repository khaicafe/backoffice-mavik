import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    Grid,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ComboService from "../../services/ComboService";
import MenuService from "../../services/MenuService";
import ProductService from "../../services/ProductService";
import ImagePicker from '../BaseComponent/ImagePicker';

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

const MenuList = () => {
    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [imageURL, setImageURL] = useState('');
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [menuDetails, setMenuDetails] = useState({ name: "", products: [], combos: [] });
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [combos, setCombos] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCombos, setSelectedCombos] = useState([]);
    const [qty, setQty] = useState({});
    const [productPrices, setProductPrices] = useState({});
    
    useEffect(() => {
        const fetchMenus = async () => {
            const response = await MenuService.getAllMenus();
            setMenus(response.data);
            setFilteredMenus(response.data);
        };

        fetchMenus();
    }, []);

    useEffect(() => {
        const fetchProductsAndCombos = async () => {
            try {
                const [productsResponse, combosResponse] = await Promise.all([
                    ProductService.getAllProducts(),
                    ComboService.getAllCombos(),
                ]);
                console.log(productsResponse, combosResponse);
                setProducts(productsResponse.data || []);
                setCombos(combosResponse.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setLoading(false);
            }
        };

        fetchProductsAndCombos();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const results = menus.filter((menu) =>
                menu.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMenus(results);
        } else {
            setFilteredMenus(menus);
        }
    }, [searchTerm, menus]);

    // image
    const handleImageSelect = (url) => {
        setImageURL(url);
    };

    const handleOpenModal = (menu = null) => {
        console.log('handleOpenModal', menu);
        if (menu) {
            // Fill modal with menu details for editing
            setMenuDetails({
                name: menu.name,
                products: menu.products.map(pc => ({
                    product_id: pc.product_id,
                    qty: pc.qty,
                    price: pc.price
                })),
                combos: menu.combos.map(cm => ({
                    combo_id: cm.combo_id,
                    qty: cm.qty,
                    price: cm.price
                }))
            });
            setSelectedMenu(menu);
            setSelectedProducts(menu.products.map(pc => ({
                ID: pc.ID,
                name: pc.name
            })));
            setSelectedCombos(menu.combos.map(cm => ({
                ID: cm.ID,
                name: cm.name
            })));
            setQty(menu.products.reduce((acc, curr) => ({ ...acc, [curr.product_id]: curr.qty }), {}));
            setProductPrices(menu.products.reduce((acc, curr) => ({ ...acc, [curr.product_id]: curr.price }), {}));
        } else {
            // Reset modal for creating new menu
            setMenuDetails({ name: "", products: [], combos: [] });
            setSelectedProducts([]);
            setSelectedCombos([]);
            setQty({});
            setProductPrices({});
            setSelectedMenu(null);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSaveMenu = async () => {
        const tem = {
            "name": "Menu 1",
            "products": [
              {"ID": 1},
              {"ID": 2}
            ],
            "combos": [
              {"ID": 3},
              {"ID": 4}
            ]
          }
        try {
            const menuData = {
                name: menuDetails.name,
                image_link_square: imageURL,
                image_link_portrait: imageURL,
                products: selectedProducts.map((product) => ({
                    ID: product.ID,
                    // qty: qty[product.ID] || 1,
                    // price: productPrices[product.ID] || 0,
                })),
                combos: selectedCombos.map((combo) => ({
                    ID: combo.ID,
                    // qty: qty[combo.ID] || 1,
                    // price: productPrices[combo.ID] || 0,
                })),
            };
            console.log(menuData, selectedMenu.ID);

            if (selectedMenu) {
                await MenuService.updateMenu(selectedMenu.ID, menuData);
                toast.success("Menu updated successfully.");
            } else {
                await MenuService.createMenu(menuData);
                toast.success("Menu created successfully.");
            }

            setOpenModal(false);
            const response = await MenuService.getAllMenus();
            setMenus(response.data);
            setFilteredMenus(response.data);
        } catch (error) {
            console.error("Failed to save menu:", error);
            toast.error("Failed to save menu.");
        }
    };

    const handleDeleteMenu = async (id) => {
        try {
            await MenuService.deleteMenu(id);
            setMenus(menus.filter((menu) => menu.ID !== id));
            setFilteredMenus(filteredMenus.filter((menu) => menu.ID !== id));
            toast.success("Menu deleted successfully.");
        } catch (error) {
            console.error("Failed to delete menu:", error);
            toast.error("Failed to delete menu.");
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Menu List
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal()}
                sx={{ marginBottom: 2 }}
            >
                Add Menu
            </Button>

            <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 20, width: '100%' }}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMenus.map((menu) => (
                            <TableRow key={menu.ID}>
                                <TableCell>{menu.ID}</TableCell>
                                <TableCell>{menu.name}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleOpenModal(menu)}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDeleteMenu(menu.ID)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
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
                        {selectedMenu ? "Edit Menu" : "Add Menu"}
                    </Typography>

                    {/* image */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" component="h3" gutterBottom>
                            Menu image
                        </Typography>
                        <ImagePicker onImageSelect={handleImageSelect} defaultImage={imageURL} />
                    </Grid>

                    <TextField
                        label="Menu Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={menuDetails.name}
                        onChange={(e) => setMenuDetails({ ...menuDetails, name: e.target.value })}
                    />

                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <>
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
                                    <TextField {...params} label="Select Products" placeholder="Select products" />
                                )}
                                sx={{ marginTop: 2 }}
                            />

                            <Autocomplete
                                multiple
                                options={combos}
                                value={selectedCombos}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.ID === value.ID}
                                onChange={(event, newValue) => setSelectedCombos(newValue)}
                                renderOption={(props, option) => {
                                    const { key, ...otherProps } = props; // Tách key ra khỏi props

                                    return (
                                        <li {...otherProps} key={key}>
                                            <Checkbox
                                                checked={selectedCombos.some((combo) => combo.ID === option.ID)}
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
                                    <TextField {...params} label="Select Combos" placeholder="Select combos" />
                                )}
                                sx={{ marginTop: 2 }}
                            />
                        </>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveMenu}
                        sx={{ marginTop: 2 }}
                    >
                        {selectedMenu ? "Save Changes" : "Create Menu"}
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default MenuList;
