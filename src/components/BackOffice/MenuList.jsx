import {
    Box,
    Button,
    Checkbox,
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
    Typography
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
    width: 1000,
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
    const [openMenuModal, setOpenMenuModal] = useState(false);
    const [openProductModal, setOpenProductModal] = useState(false);
    const [openComboModal, setOpenComboModal] = useState(false);
    const [menuDetails, setMenuDetails] = useState({ name: "", products: [], combos: [] });
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [combos, setCombos] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCombos, setSelectedCombos] = useState([]);
    const [qty, setQty] = useState({});
    const [productPrices, setProductPrices] = useState({});
    const [allProductsSelected, setAllProductsSelected] = useState(false);
    const [allCombosSelected, setAllCombosSelected] = useState(false);

    useEffect(() => {
        const fetchMenus = async () => {
            const response = await MenuService.getAllMenus();
            console.log(response.data);
            setMenus(response.data);
            setFilteredMenus(response.data);

            const respons = await MenuService.getAllMenusPos();
            console.log('data menu',respons.data);
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

    const handleOpenMenuModal = (menu = null) => {
        if (menu) {
            setImageURL(menu.image);
            setMenuDetails({
                name: menu.name,
                image: menu.image,
                products: menu.products,
                combos: menu.combos,
            });
            setSelectedMenu(menu);
            setSelectedProducts(menu.products);
            setSelectedCombos(menu.combos);
        } else {
            setMenuDetails({ name: "", products: [], combos: [] });
            setSelectedProducts([]);
            setSelectedCombos([]);
            setSelectedMenu(null);
        }
        setOpenMenuModal(true);
    };

    const handleCloseMenuModal = () => {
        setOpenMenuModal(false);
    };

    const handleSaveMenu = async () => {
        try {
            const menuData = {
                name: menuDetails.name,
                image: imageURL,
                products: selectedProducts.map((product) => ({
                    ID: product.ID,
                })),
                combos: selectedCombos.map((combo) => ({
                    ID: combo.ID,
                })),
            };

            console.log(menuData);

            if (selectedMenu) {
                await MenuService.updateMenu(selectedMenu.ID, menuData);
                toast.success("Menu updated successfully.");
            } else {
                await MenuService.createMenu(menuData);
                toast.success("Menu created successfully.");
            }

            setOpenMenuModal(false);
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

    const handleToggleAllProducts = () => {
        if (allProductsSelected) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products);
        }
        setAllProductsSelected(!allProductsSelected);
    };

    const handleToggleAllCombos = () => {
        if (allCombosSelected) {
            setSelectedCombos([]);
        } else {
            setSelectedCombos(combos);
        }
        setAllCombosSelected(!allCombosSelected);
    };

    return (
        <div style={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>
                Menu List
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenMenuModal()}
            >
                Add Menu
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
                            <TableCell>ID</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMenus.map((menu) => (
                            <TableRow key={menu.ID}>
                                <TableCell>{menu.ID}</TableCell>
                                <TableCell><img src={menu.image} alt={menu.image} style={{ width: 70 }} /></TableCell>
                                <TableCell>{menu.name}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleOpenMenuModal(menu)}
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
                open={openMenuModal}
                onClose={handleCloseMenuModal}
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
                        <ImagePicker onImageSelect={setImageURL} defaultImage={imageURL} />
                    </Grid>

                    <TextField
                        label="Menu Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={menuDetails.name}
                        onChange={(e) => setMenuDetails({ ...menuDetails, name: e.target.value })}
                    />

                    <Button variant="contained" color="primary" onClick={() => setOpenProductModal(true)}>
                        Select Products
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => setOpenComboModal(true)} sx={{ ml: 2 }}>
                        Select Combos
                    </Button>

                    <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: 1000 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedProducts.map((product) => (
                                    <TableRow key={product.ID}>
                                        <TableCell>{product.ID}</TableCell>
                                        <TableCell><img src={product.image_link_square} alt={product.image_link_square} style={{ width: 70 }} /></TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                       
                                    </TableRow>
                                ))}
                                {selectedCombos.map((combo) => (
                                    <TableRow key={combo.ID}>
                                        <TableCell>{combo.ID}</TableCell>
                                        <TableCell><img src={combo.image_link_square} alt={combo.image_link_square} style={{ width: 70 }} /></TableCell>
                                        <TableCell>{combo.name}</TableCell>
                                        <TableCell>{combo.price}</TableCell>
                                        
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

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

            {/* Modal for Selecting Products */}
            <Modal
                open={openProductModal}
                onClose={() => setOpenProductModal(false)}
                aria-labelledby="product-modal-title"
                aria-describedby="product-modal-description"
            >
                <Box sx={modalStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <Typography id="product-modal-title" variant="h6" component="h2">
                            Select Products
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleToggleAllProducts}>
                            {allProductsSelected ? "Uncheck All" : "Check All"}
                        </Button>
                    </div>
                    <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: 400 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Select</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.ID}>
                                        <TableCell>{product.ID}</TableCell>
                                        <TableCell><img src={product.image_link_square} alt={product.image_link_square} style={{ width: 60 }} /></TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedProducts.some((p) => p.ID === product.ID)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedProducts([...selectedProducts, product]);
                                                    } else {
                                                        setSelectedProducts(selectedProducts.filter((p) => p.ID !== product.ID));
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenProductModal(false)}
                        sx={{ marginTop: 2 }}
                    >
                        Done
                    </Button>
                </Box>
            </Modal>

            {/* Modal for Selecting Combos */}
            <Modal
                open={openComboModal}
                onClose={() => setOpenComboModal(false)}
                aria-labelledby="combo-modal-title"
                aria-describedby="combo-modal-description"
            >
                <Box sx={modalStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <Typography id="combo-modal-title" variant="h6" component="h2">
                            Select Combos
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleToggleAllCombos}>
                            {allCombosSelected ? "Uncheck All" : "Check All"}
                        </Button>
                    </div>
                    <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: 400 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Select</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {combos.map((combo) => (
                                    <TableRow key={combo.ID}>
                                        <TableCell>{combo.ID}</TableCell>
                                        <TableCell><img src={combo.image_link_square} alt={combo.image_link_square} style={{ width: 60 }} /></TableCell>
                                        <TableCell>{combo.name}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedCombos.some((c) => c.ID === combo.ID)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedCombos([...selectedCombos, combo]);
                                                    } else {
                                                        setSelectedCombos(selectedCombos.filter((c) => c.ID !== combo.ID));
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenComboModal(false)}
                        sx={{ marginTop: 2 }}
                    >
                        Done
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default MenuList;
