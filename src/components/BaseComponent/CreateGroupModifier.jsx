import {
    Button,
    Checkbox,
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
import GroupService from "../../services/GroupModifierService"; // Import the service for Group CRUD operations
import Modifiers from "../../services/ModifierService";
import uploadimage from "../../services/uploadimageService";

const GrouptModifier = () => {
    const initialFormValues = {
        id: "",
        name: "", //
        description: "", //
        average_rating: 0,
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
        Categories: []
    };

    const [formValues, setFormValues] = useState(initialFormValues);

    const [modifiers, setModifiers] = useState([]);
    const [openModifierModal, setOpenModifierModal] = useState(false); // State to manage the Modifier modal
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [groupModifiers, setGroupModifiers] = useState([]);
    const [newGroupName, setNewGroupName] = useState(""); // State to handle new Group Modifier name
    const { id } = useParams();
    const navigate = useNavigate();
     // State để quản lý minQty và maxQty
     const [minQty, setMinQty] = useState(0);
     const [maxQty, setMaxQty] = useState(0);

     const handleModifierModalOpen = () => setOpenModifierModal(true); // Open Modifier modal
     const handleModifierModalClose = () => setOpenModifierModal(false); // Close Modifier modal
 

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
        // fetchCategories();
        fetchModifiers();
        // fetchTempertures();
        // fetchSizes();
        fetchGroupModifiers(); // Fetch existing group modifiers
    }, [id]);

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

    
    const fetchModifiers = async () => {
        try {
            const response = await Modifiers.getAllModifiers();
            setModifiers(response.data.dataTable || []);
            console.log('modifier', response.data.dataTable);
        } catch (error) {
            console.error("Failed to fetch modifiers:", error);
            setModifiers([]);
        }
    };

    const fetchGroupModifiers = async () => {
        try {
            const response = await GroupService.getAllGroupModifiers(); // Use GroupService to fetch group modifiers
            setGroupModifiers(response.data || []);
            console.log('fetchGroupModifiers',response.data);
        } catch (error) {
            console.error("Failed to fetch group modifiers:", error);
            setGroupModifiers([]);
        }
    };
    
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
    
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('image', image);
        try {
            const response = await uploadimage.uploadimage(formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const imageUrl = `http://${response.data.url}`;
            setImageURL(imageUrl);
            setFormValues({
                ...formValues,
                imagelink_square: imageUrl
            });
        } catch (error) {
            console.error('Error uploading the image:', error);
        }
    };

return (
    <div>
         {/* <Box
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
    > */}
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

        
    {/* </Box> */}
    </div>
   
    );
};

export default GrouptModifier;
   

