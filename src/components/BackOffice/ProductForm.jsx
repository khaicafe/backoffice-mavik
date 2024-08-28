import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Link,
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
import { useNavigate, useParams } from "react-router-dom";
import CategoryService from "../../services/CategoryService";
import GroupService from "../../services/GroupModifierService"; // Import the service for Group CRUD operations
import Modifiers from "../../services/ModifierService";
import Product from "../../services/ProductService";
import Size from "../../services/SizeService";
import Temperture from "../../services/TemperatureService";
import { COLORS } from "../../theme/themeColor";
import ImagePicker from '../BaseComponent/ImagePicker';

const AddProductForm = () => {
    const initialFormValues = {
        id: "",
        name: "", //
        description: "", //
        average_rating: 0,
        price: 0,
        type: "", //
        discount: 0,
        favourite: false,
        imagelink_portrait: "",
        imagelink_square: "",
        ingredients: "",
        options: [],
        modifiers: [],
        ratings_count: "0",
        roasted: "",
        special_ingredient: "",
        Category: []
    };

    const [formValues, setFormValues] = useState(initialFormValues);
    const [category, setCategory] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [modifiers, setModifiers] = useState([]);
    const [tempertures, setTempertures] = useState([]);
    const [variations, setVariations] = useState([]);
    const [selectedVariations, setSelectedVariations] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [prices, setPrices] = useState({});
    const [showTable, setShowTable] = useState(false);
    const [open, setOpen] = useState(false);
    const [openModifierModal, setOpenModifierModal] = useState(false); // State to manage the Modifier modal
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [groupModifiers, setGroupModifiers] = useState([]);
    const [selectedGroupModifiers, setSelectedGroupModifiers] = useState([]);
    const [newGroupName, setNewGroupName] = useState(""); // State to handle new Group Modifier name
    const { id } = useParams();
    const navigate = useNavigate();
     // State để quản lý minQty và maxQty
     const [minQty, setMinQty] = useState(0);
     const [maxQty, setMaxQty] = useState(0);

     // State để quản lý các modifier đã chọn
     const [selectedModifiers, setSelectedModifiers] = useState([]);

    // check validity of modifiers
    function updateDefaults(items, count) {
        // Đầu tiên, set tất cả các giá trị Default thành false
        const updatedItems = items.map((item) => ({ ...item, Default: false }));
    
        // Sau đó, set các giá trị Default thành true theo index từ 0 đến count-1
        for (let i = 0; i < count; i++) {
            if (updatedItems[i]) {
                updatedItems[i].Default = true;
            }
        }
    
        return updatedItems;
    }

    useEffect(() => {
        console.log(maxQty, minQty, selectedModifiers)
         // Cập nhật minQty dựa trên số lượng này
         if (minQty >= maxQty) {
             // set lại check default
            setMinQty(maxQty);
        }
        
        const countTrueDefaults = selectedModifiers?.filter(item => item.Default === true).length;
        if (countTrueDefaults > minQty){
            console.log('countTrueDefaults', countTrueDefaults, minQty)
            const updatedItems = updateDefaults(selectedModifiers, minQty);
            setSelectedModifiers(updatedItems);
            console.log('countTrueDefaults', selectedModifiers)
        }
       
    }, [minQty, maxQty]);
     // Hàm xử lý chọn hoặc bỏ chọn modifier
    const handleModifierSelect = (modifierID) => {
        
        let updatedModifiers = [...selectedModifiers];
        const index = updatedModifiers.findIndex((m) => m.ID === modifierID);

        if (index !== -1) {
            updatedModifiers.splice(index, 1); // Nếu đã chọn thì bỏ chọn
        } else {
            updatedModifiers.push({ ID: modifierID, Default: false }); // Thêm modifier với default là false
        }

         // Tính toán số lượng các checkbox Select được chọn
         const selectedCount = updatedModifiers.length;

         // Cập nhật maxQty dựa trên số lượng này
         setMaxQty(selectedCount);
        
        setSelectedModifiers(updatedModifiers);
       
    };
 
     
     const handleCreateGroupModifier = async(groupData) => {
        try {
            const response = await GroupService.createGroupModifier(groupData);
            setGroupModifiers([...groupModifiers, response.data]);
            // console.log('groupModifiers', groupModifiers)
            setNewGroupName(""); // Clear the input after creation
        } catch (error) {
            console.error("Failed to create group modifier:", error);
        }
    };

    const handleSubmitGroupModifier =  () => {
        console.log("name group", newGroupName)
        if (newGroupName && selectedModifiers.length > 0) {
             // Đảm bảo rằng tất cả thông tin được thu thập
            const groupData = {
                name: newGroupName,
                min_qty: minQty,
                max_qty: maxQty,
                modifier_ids: selectedModifiers,
            };

            // Gọi hàm gửi dữ liệu lên backend
            handleCreateGroupModifier(groupData);

            // Đóng modal và reset state nếu cần
            handleModifierModalClose();
            setNewGroupName('');
            setMinQty(0);
            setMaxQty(0);
            setSelectedModifiers([]);
        }
        
    };

    const handleDefaultChoiceChangeModifier = (modifierID) => {
        setSelectedModifiers((prevModifiers) => {
            const updatedModifiers = prevModifiers.map((modifier) =>
                modifier.ID === modifierID
                    ? { ...modifier, Default: !modifier.Default }
                    : modifier
            );
    
            // Tính toán số lượng các checkbox Default được chọn
            const checkedCount = updatedModifiers.filter((modifier) => modifier.Default).length;
    
            // Cập nhật minQty dựa trên số lượng này
            setMinQty(checkedCount);
    
            return updatedModifiers;
        });
    };

    
    const handleGroupModifierChange = (event, value) => {
        const updatedArray = value.map(item => {
            // thêm field type default customize false
            if (item.type === undefined) {
                return { ...item, type: false };
            }
            return item;
        });
        console.log('handleGroupModifierChange',updatedArray)

        setSelectedGroupModifiers(updatedArray);
        // formValues.modifiers = updatedArray
    };

    const handleCustomizeSelect = (value) => {
        // Lọc và thêm field type: true
        const updatedArray = selectedGroupModifiers.map(item => {
            if (item.ID === value.ID) {
                return { ...item, type: !item.type };
            
            // } else if (item.type === undefined) {
                // return { ...item, type: false };
            }
            return item;
        });
        console.log('updatedArray', updatedArray);
        setSelectedGroupModifiers(updatedArray);
    };
     

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleModifierModalOpen = () => setOpenModifierModal(true); // Open Modifier modal
    const handleModifierModalClose = () => setOpenModifierModal(false); // Close Modifier modal

    const [categoryLoaded, setCategoryLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await fetchCategory();
            setCategoryLoaded(true); // Đánh dấu rằng category đã được load xong
        };
    
        fetchData();
    }, []); // Chạy một lần khi component mount

   useEffect(() => {
        if (categoryLoaded) {
            // Chỉ chạy khi category đã được load xong
            fetchModifiers();
            fetchTempertures();
            fetchSizes();
            fetchGroupModifiers();

            if (id) {
                fetchProduct(id); // Chỉ thực hiện sau khi tất cả dữ liệu khác đã được tải xong
            }
        }
    }, [categoryLoaded, id]); // Chỉ chạy khi categoryLoaded hoặc id thay đổi



    useEffect(() => {
        if (tempertures.length > 0 && sizes.length > 0) {
            const generatedVariations = tempertures.flatMap(temperature =>
                sizes.map(size => ({
                    variation: `${temperature.name}, ${size.name}`,
                    temperature_id: temperature.ID,
                    size_id: size.ID,
                    selected: true,
                    price: "",
                    currency: "",
                }))
            );
            setVariations(generatedVariations);
        }
    }, [tempertures, sizes]);

   

    const fetchProduct = async (id) => {
        const response = await Product.getProduct(id);
        console.log('edit', response.data)
        const data = response.data;

       
        const categoryIds = data.product_category.map(item => item.category_id);

        // Chỉ lọc sau khi category đã được load xong
        if (category.length > 0) {
            const filteredB = category.filter(item => categoryIds.includes(item.ID));
            setSelectedCategory(filteredB);
            // console.log('filteredB', filteredB);
        } else {
            console.log('Category chưa load kịp');
        }
     

        // option

       // Map product_temp_sizes thành selectedVariations và variations
       const selected = data.product_temp_sizes.map((item) => ({
            variation: `${item.temperature.name}, ${item.size.name}`,
            price: item.price,
            currency: item.currency,
            default: item.default,
            temperature_id: item.temperature_id,
            size_id: item.size_id,
        }));
        setShowTable(true);
        console.log(selected);

        // Cập nhật state cho cả selectedVariations và variations
        setSelectedVariations(selected);
        setVariations(selected);

        // modifier
        setSelectedGroupModifiers(data.product_groups.map(product_group => {
            // Ensure that Group and group_modifiers are not null or undefined
            const groupModifiers = product_group.group?.group_modifiers || [];
        
            return {
                ID: product_group.ID,
                Name: product_group.group?.name || "",  // If name is not available, use an empty string
                MinQty: product_group.group?.min_qty || 0,
                MaxQty: product_group.group?.max_qty || 0,
                type: product_group.type,
                Modifier: groupModifiers.map(item => ({
                    ID: item.modifier_id,
                    Default: item.default,
                    Name: item.Modifier?.name || "",  // Check if Modifier is available
                    Price: item.Modifier?.price || 0,
                    Currency: item.Modifier?.currency || ""
                })),
            };
        }));


        // Cập nhật URL hình ảnh nếu có
        setImageURL(data.image_link_square);
        console.log(data.image_link_square)
        formValues.imagelink_square = data.image_link_square;

    
        setFormValues({
            id: data.ID,
            name: data.name,
            description: data.description, //
            average_rating: data.average_rating,
            price: data.price,
            type: data.type,
            discount: data.discount,
            favourite: data.favourite,
            imagelink_portrait: data.imagelink_portrait,
            imagelink_square: data.imagelink_square,
            ingredients: data.ingredients,
            options: [],
            modifiers: [],
            ratings_count: data.ratings_count,
            roasted: data.roasted,
            special_ingredient: data.special_ingredient,
            Category: []
        });
    };

    const fetchCategory = async () => {
        try {
            const response = await CategoryService.getAllCategories();
            setCategory(response.data.dataTable || []);
            // console.log('fetchCategory',response.data.dataTable)
        } catch (error) {
            console.error("Failed to fetch category:", error);
            setCategory([]);
        }
    };

    const fetchTempertures = async () => {
        try {
            const response = await Temperture.getAllTemperatures();
            setTempertures(response.data.dataTable || []);
            // console.log('setTempertures', response.data.dataTable);
        } catch (error) {
            console.error("Failed to fetch temperatures:", error);
            setTempertures([]);
        }
    };

    const fetchModifiers = async () => {
        try {
            const response = await Modifiers.getAllModifiers();
            setModifiers(response.data.dataTable || []);
            // console.log('modifier', response.data.dataTable);
        } catch (error) {
            console.error("Failed to fetch modifiers:", error);
            setModifiers([]);
        }
    };

    const fetchSizes = async () => {
        try {
            const response = await Size.getAllSizes();
            setSizes(response.data.dataTable || []);
            // console.log('setSizes',response.data.dataTable);
        } catch (error) {
            console.error("Failed to fetch sizes:", error);
            setSizes([]);
        }
    };

    const fetchGroupModifiers = async () => {
        try {
            const response = await GroupService.getAllGroupModifiers(); // Use GroupService to fetch group modifiers
            setGroupModifiers(response.data || []);
            // console.log('fetchGroupModifiers',response.data);
        } catch (error) {
            console.error("Failed to fetch group modifiers:", error);
            setGroupModifiers([]);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    /// variation

    const handleVariationSelect = (variation) => {
        console.log('handleVariationSelect',variation)
        let updatedSelections = [...selectedVariations];

        const index = updatedSelections.findIndex(v => v.variation === variation.variation);

        if (index !== -1) {
            updatedSelections.splice(index, 1); // Remove if already selected
        } else {
            updatedSelections.push({
                variation: variation.variation,
                price: prices[variation.variation] || 0,
                default: variation.isDefault || false,
                temperature_id: variation.temperature_id,
                size_id: variation.size_id,
                currency: variation.currency || "$",
            });
        }
        if(updatedSelections.length > 0) {
            // console.log(updatedSelections)
            updatedSelections[0].default = true; 
        }

        setSelectedVariations(updatedSelections);
    };

    const handlePriceChange = (variationName, price) => {
        setPrices({
            ...prices,
            [variationName]: parseFloat(price),
        });
        const updatedSelections = selectedVariations.map((v) =>
            v.variation === variationName ? { ...v, price } : v
        );
        setSelectedVariations(updatedSelections);
    };
    const handleCurrencyChange = (variationName, currency) => {
        setPrices({
            ...currency,
            [variationName]: currency,
        });
        const updatedSelections = selectedVariations.map((v) =>
            v.variation === variationName ? { ...v, currency } : v
        );
        setSelectedVariations(updatedSelections);
    };

    const handleDefaultChoiceChange = (variationIndex) => {
        let updatedSelections = selectedVariations.map((v, idx) => ({
            ...v,
            default: idx === variationIndex
        }));
        setSelectedVariations(updatedSelections);
           
    };

    const handleCreateVariations = () => {
        setShowTable(true);
        handleClose();
    };

    // category
    const handleCategoryChange = (event, value) => {
        console.log('category', value);
        setSelectedCategory(value); 
        value = value.map(category => {
            category.category_id = category.ID;
            return category;
        });
        formValues.Category = value;
    };
    // image
    const handleImageSelect = (url) => {
        console.log('Selected URL:', url);
        // formValues.imagelink_square = url;
        setImageURL(url);
      };

    // check field input
     // Hàm này chuyên để cập nhật giá sản phẩm
     const handlePriceProductChange = (e) => {
        const value = e.target.value;

        // Chuyển giá trị từ chuỗi sang số và đảm bảo giá trị không phải là số âm
        if (!isNaN(value) && Number(value) >= 0) {
            setFormValues({
                ...formValues,
                price: parseFloat(value)
            });
        }
    };
    // save product information

    const handleSave = async () => {
      
        const updated_selectedGroupModifiers = selectedGroupModifiers.map(group => ({
            ...group,
            group_id: group.ID
        }));
        
        
        console.log(updated_selectedGroupModifiers);

        const productData = {
            "name": formValues.name,
            "description": formValues.description,
            "price": formValues.price,
            // "currency": formValues.currency,
            "roasted": "Dark Roasted",
            "image_link_square": imageURL,
            "image_link_portrait": imageURL,
            "ingredients": "Coffee beans, Water",
            "special_ingredient": "Single Origin",
            "discount": 0,
            "average_rating": 4.8,
            "ratings_count": "100",
            "favourite": true,
            "product_groups": updated_selectedGroupModifiers,
            "product_temp_sizes": selectedVariations,
            "product_category": formValues.Category
        }
        
        console.log("Product data to be saved:", productData);
        if (id) {
             // Here you can call your API to save the product data
            try {
                const response = await Product.updateProduct(id, productData);
                console.log("Product updated successfully:", response.data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            }
        }else {
             // Here you can call your API to save the product data
            try {
                const response = await Product.createProduct(productData);
                console.log("Product saved successfully:", response.data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            }
        }
       

    };

   


    return (
        <Grid container spacing={2}>
            {/* image */}
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" component="h3" gutterBottom>
                    Product image
                </Typography>
                <ImagePicker onImageSelect={handleImageSelect} defaultImage= {imageURL}/>
            </Grid>

            <Grid item xs={12} sm={6}>
                <Typography variant="h6" component="h3" gutterBottom>
                    Product Name
                </Typography>
                <TextField
                    label="Product Name"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <Typography variant="h6" component="h3" gutterBottom>
                    Description
                </Typography>
                <TextField
                    label="Description"
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </Grid>
            
            {/* price  */}
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" component="h3" gutterBottom>
                    Price Product
                </Typography>
                <TextField
                    label="Price"
                    type="number"
                    name="price"
                    value={formValues.price}
                    onChange={handlePriceProductChange} // Sử dụng hàm handlePriceChange để cập nhật giá
                    variant="outlined"
                    fullWidth
                    InputProps={{ inputProps: { min: 0 } }} // Đảm bảo không nhập số âm
                />
            </Grid>

            {/* modifier group */}
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" component="h3" gutterBottom>
                    Modifier
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Modifier set customizations will apply to this item only.{' '}
                    <Link href="#learn-more" underline="hover">
                        Learn more
                    </Link>
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2, // Khoảng cách giữa các nút
                    }}
                >
                    {/* Autocomplete for selecting existing Group Modifiers */}
                    <Autocomplete
                        multiple
                        disableCloseOnSelect
                        options={groupModifiers}
                        value={selectedGroupModifiers}  // Đặt giá trị đã chọn vào đây
                        isOptionEqualToValue={(option, value) =>
                            // fix warning
                            option.ID === value.ID
                        } // Tùy chỉnh cách so sánh
                        getOptionLabel={(option) =>{
                            return option ? option.Name || "" : ""; // Đảm bảo trả về một chuỗi hợp lệ
                          }}
                        onChange={handleGroupModifierChange}
                        sx={{
                            flex: 1, // Để các nút có kích thước bằng nhau
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Search Group Modifiers"
                                placeholder="Select group modifiers"
                            />
                        )}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            flex: 1, // Để các nút có kích thước bằng nhau
                            backgroundColor: '#f3f4f6',
                            color: '#007bff',
                            border: '1px solid #ccc',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#e7e7e7',
                            },
                        }}
                        onClick={handleModifierModalOpen} // Show Modifier modal
                    >
                        Create Group Modifier
                    </Button>
                </Box>

                {/* Hiển thị Group Modifiers đã chọn dưới nút "Add Modifier" */}
                {selectedGroupModifiers.length > 0 && (
                    <Box mt={2}>
                        {selectedGroupModifiers.map((groupModifier, index) => (
                            <Box key={index} mt={2}>
                                <Box
                                 sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between', // Giãn đều các phần tử
                                        alignItems: 'center', // Căn giữa theo chiều dọc
                                        gap: 2, // Khoảng cách giữa các Typography
                                        background: COLORS.BLUE,
                                        paddingLeft: 2,
                                        paddingRight: 2,
                                        color: COLORS.WHITE
                                    }}
                                >
                                    <Typography variant="h6" component="h3" gutterBottom>
                                        {groupModifier.Name} {/* Display the Group Name */}
                                    </Typography>
                                    <Typography gutterBottom>
                                        minQty: {groupModifier.MinQty} {/* Display the Group Name */}
                                    </Typography>
                                    <Typography gutterBottom>
                                        maxQty: {groupModifier.MaxQty} {/* Display the Group Name */}
                                    </Typography>
                                    <FormControlLabel
                                        control={<Checkbox 
                                            checked={groupModifier.type || false} 
                                            onChange={() => handleCustomizeSelect(groupModifier)}/>}
                                        label="Customize"
                                    />
                                </Box>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Modifier Name</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Default Choice</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {groupModifier.Modifier.map((modifier, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{modifier.Name}</TableCell>
                                                    <TableCell>{modifier.Currency} {modifier.Price}</TableCell>
                                                    <TableCell>{modifier.Default ? "True" : "False"}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        ))}
                    </Box>
                )}
            </Grid>
           
           
           
            {/* Options */}
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" component="h3" gutterBottom>
                    Options
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Add a custom set of options to an item to create variations. For example, a size option set can create variations small, medium, and large.{' '}
                    <Link href="#learn-more" underline="hover">
                        Learn more
                    </Link>
                </Typography>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundColor: '#f3f4f6',
                        color: '#007bff',
                        border: '1px solid #ccc',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#e7e7e7',
                        },
                    }}
                    onClick={handleOpen}
                >
                    Add options
                </Button>
                {/* Hiển thị bảng variations dưới nút "Add options" */}
                {showTable && (
                <Box mt={4}>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Variations
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Variation</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell align="center">Default Choice</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedVariations.map((variation, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{variation.variation}</TableCell>
                                        <TableCell>{variation.currency} {variation.price || "0.00"}</TableCell>
                                        {/* <TableCell>{variation.Default ? "True" : "False"}</TableCell> */}
                                        <TableCell align="center">
                                            <Checkbox
                                                checked={variation.default || false}
                                                onChange={(e) => handleDefaultChoiceChange(index)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
            </Grid>

            {/* category */}           
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" component="h3" gutterBottom>
                    Category
                </Typography>
                <Autocomplete
                    multiple
                    options={category}
                    value={selectedCategory}  // Đặt giá trị đã chọn vào đây
                    isOptionEqualToValue={(option, value) =>
                        // fix warning
                        option.ID === value.ID
                    } // Tùy chỉnh cách so sánh
                    getOptionLabel={(option) =>{
                        return option ? option.name || "" : ""; // Đảm bảo trả về một chuỗi hợp lệ
                      }}
                    onChange={handleCategoryChange}
                    sx={{
                        flex: 1, // Để các nút có kích thước bằng nhau
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Search Category"
                            placeholder="Select Category"
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
               
            </Grid>

            <Grid item xs={12} sm={6}>
                <Button variant="contained" color="primary"  onClick={handleSave}
                >
                    Save Product
                </Button>
            </Grid>

            {/* popup options */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="create-variations-title"
                aria-describedby="create-variations-description"
            >
              <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 800,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="create-variations-title" variant="h6" component="h2" gutterBottom>
                        Create variations
                    </Typography>
                    <Typography id="create-variations-description" variant="body2" color="textSecondary" gutterBottom>
                        The variations below will be created from your options.
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Variation</TableCell>
                                    <TableCell>Currency</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {variations.map((variation, index) => {
                                    const selected = selectedVariations.find(v => v.variation === variation.variation) || {};

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedVariations.some(v => v.variation === variation.variation)}
                                                            onChange={() => handleVariationSelect(variation)}
                                                        />
                                                    }
                                                    label={variation.variation}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    label="Currency"
                                                    disabled = {!selectedVariations.some(v => v.variation === variation.variation)}
                                                    variant="outlined"
                                                    InputLabelProps={{ shrink: true }}
                                                    size="small"
                                                    value={selected.currency !== undefined ? selected.currency : '$'}
                                                    onChange={(e) => handleCurrencyChange(variation.variation, e.target.value)}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    label="Price"
                                                    type="number"
                                                    disabled = {!selectedVariations.some(v => v.variation === variation.variation)}
                                                    variant="outlined"
                                                    InputLabelProps={{ shrink: true }}
                                                    size="small"
                                                    value={selected.price !== undefined ? selected.price : 0}
                                                    onChange={(e) => handlePriceChange(variation.variation, parseFloat(e.target.value))}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            
                                        </TableRow>
                                    );
                                })}
                            </TableBody>

                        </Table>
                    </TableContainer>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateVariations}
                        sx={{ mt: 2, width: '100%' }}
                    >
                        Create {selectedVariations.length} variations
                    </Button>
                </Box>
            </Modal>

           {/* Modal cho việc thêm Modifier và Group Modifier */}
            <Modal
                open={openModifierModal}
                onClose={handleModifierModalClose}
                aria-labelledby="add-modifier-title"
                aria-describedby="add-modifier-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="add-modifier-title" variant="h6" component="h2" gutterBottom>
                        Create Modifier Group
                    </Typography>

                    {/* Input for creating new Group Modifier */}
                    <TextField
                        label="New Group Modifier"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        fullWidth
                        margin="dense"
                    />

                    {/* Input for min_qty */}
                    <TextField
                        label="Min Quantity"
                        type="number"
                        value={minQty}
                        onChange={(e) => setMinQty(e.target.value)}
                        fullWidth
                        disabled
                        margin="dense"
                        sx={{ mt: 2 }}
                    />

                    {/* Input for max_qty */}
                    <TextField
                        label="Max Quantity"
                        type="number"
                        value={maxQty}
                        onChange={(e) => setMaxQty(e.target.value)}
                        fullWidth
                        margin="dense"
                        sx={{ mt: 2 }}
                    />

                    {/* Table for selecting Modifiers */}
                    <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
                        Select Modifiers
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Select</TableCell>
                                    <TableCell>Modifier Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell align="center">Default Choice</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {modifiers.map((modifier, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedModifiers.some((m) => m.ID === modifier.ID)}
                                                onChange={() => handleModifierSelect(modifier.ID)}
                                            />
                                        </TableCell>
                                        <TableCell>{modifier.name}</TableCell>
                                        <TableCell>{modifier.price}</TableCell>
                                        <TableCell align="center">
                                            <Checkbox
                                                checked={
                                                    selectedModifiers.find((m) => m.ID === modifier.ID)?.Default ||
                                                    false
                                                }
                                                onChange={() => handleDefaultChoiceChangeModifier(modifier.ID)}
                                                disabled={!selectedModifiers.some((m) => m.ID === modifier.ID)}
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
                        onClick={handleSubmitGroupModifier}
                        sx={{ mt: 2, width: '100%' }}
                    >
                        Create Group Modifier
                    </Button>
                </Box>
            </Modal>

        </Grid>
    );
};

export default AddProductForm;
