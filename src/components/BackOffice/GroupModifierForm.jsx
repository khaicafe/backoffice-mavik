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
import { toast } from "react-toastify";
import GroupService from "../../services/GroupModifierService"; // Import the service for Group CRUD operations
import Modifiers from "../../services/ModifierService";

const GrouptModifier = ({ mode = "create", groupData = null, onClose, onRefesh }) => {
    console.log("create", mode, groupData, onClose)
    const initialFormValues = {
        id: "",
        name: "", //
        description: "", //
        min_qty: 0,
        max_qty: 0,
        modifiers: [],
    };

    const [formValues, setFormValues] = useState(initialFormValues);
    const [modifiers, setModifiers] = useState([]);
    const [selectedModifiers, setSelectedModifiers] = useState([]);


    // Nếu đang ở chế độ edit, thì tải dữ liệu của group hiện tại vào form
    useEffect(() => {
        if (mode === "edit" && groupData) {
            setFormValues({
                id: groupData.ID,
                name: groupData.Name,
                min_qty: groupData.MinQty,
                max_qty: groupData.MaxQty,
                modifiers: groupData.Modifier.map(modifier => ({
                    ID: modifier.ID,
                    Default: modifier.Default,
                })),
            });
            setSelectedModifiers(groupData.Modifier.map(modifier => ({
                ID: modifier.ID,
                Default: modifier.Default,
            })));
        }
    }, [mode, groupData]);

    useEffect(() => {
        fetchModifiers();
    }, []);

    useEffect(() => {
        const countTrueDefaults = selectedModifiers?.filter(item => item.Default === true).length;
        if (countTrueDefaults > formValues.min_qty) {
            const updatedItems = updateDefaults(selectedModifiers, formValues.min_qty);
            setSelectedModifiers(updatedItems);
        }
    }, [formValues.min_qty, formValues.max_qty]);

    const fetchModifiers = async () => {
        try {
            const response = await Modifiers.getAllModifiers();
            setModifiers(response.data.dataTable || []);
        } catch (error) {
            console.error("Failed to fetch modifiers:", error);
            setModifiers([]);
        }
    };

    const updateDefaults = (items, count) => {
        const updatedItems = items.map((item) => ({ ...item, Default: false }));
        for (let i = 0; i < count; i++) {
            if (updatedItems[i]) {
                updatedItems[i].Default = true;
            }
        }
        return updatedItems;
    };

    const handleModifierSelect = (modifierID) => {
        let updatedModifiers = [...selectedModifiers];
        const index = updatedModifiers.findIndex((m) => m.ID === modifierID);

        if (index !== -1) {
            updatedModifiers.splice(index, 1); // Nếu đã chọn thì bỏ chọn
        } else {
            updatedModifiers.push({ ID: modifierID, Default: false }); // Thêm modifier với default là false
        }

        setSelectedModifiers(updatedModifiers);
        setFormValues({ ...formValues, max_qty: updatedModifiers.length });
    };

    const handleDefaultChoiceChangeModifier = (modifierID) => {
        setSelectedModifiers((prevModifiers) => {
            const updatedModifiers = prevModifiers.map((modifier) =>
                modifier.ID === modifierID
                    ? { ...modifier, Default: !modifier.Default }
                    : modifier
            );

            const checkedCount = updatedModifiers.filter((modifier) => modifier.Default).length;
            setFormValues({ ...formValues, min_qty: checkedCount });

            return updatedModifiers;
        });
    };

    const handleSubmitGroupModifier = async () => {
        const groupData = {
            id: formValues.id,
            name: formValues.name,
            min_qty: formValues.min_qty,
            max_qty: formValues.max_qty,
            modifier_ids: selectedModifiers,
        };

        try {
            if (mode === "create") {
                await GroupService.createGroupModifier(groupData);
                toast.success("Group Modifier created successfully.");
            } else if (mode === "edit") {
                await GroupService.updateGroupModifier(groupData.id, groupData);
                toast.success("Group Modifier updated successfully.");
            }
            onRefesh()
            onClose(); // Đóng modal sau khi hoàn thành
        } catch (error) {
            console.error(`Failed to ${mode} group modifier:`, error);
        }
    };

    return (
        <div>
            <Typography id="add-modifier-title" variant="h6" component="h2" gutterBottom>
                {mode === "create" ? "Create Modifier Group" : "Edit Modifier Group"}
            </Typography>

            {/* Input for Group Modifier Name */}
            <TextField
                label="Group Modifier Name"
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="dense"
            />

            {/* Input for min_qty */}
            <TextField
                label="Min Quantity"
                type="number"
                value={formValues.min_qty}
                onChange={(e) => setFormValues({ ...formValues, min_qty: e.target.value })}
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 2 }}
                disabled
            />

            {/* Input for max_qty */}
            <TextField
                label="Max Quantity"
                type="number"
                value={formValues.max_qty}
                onChange={(e) => setFormValues({ ...formValues, max_qty: e.target.value })}
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
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
                {mode === "create" ? "Create Group Modifier" : "Update Group Modifier"}
            </Button>
        </div>
    );
};

export default GrouptModifier;
