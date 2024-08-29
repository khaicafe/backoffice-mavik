import {
    Box,
    Button,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableHead,
    TableRow, TextField,
    Typography,
    tableCellClasses
} from "@mui/material";
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GroupService from "../../services/GroupModifierService"; // Import the service for Group CRUD operations
import { COLORS } from '../../theme/themeColor';
import GroupModifierForm from "./GroupModifierForm";

const GrouptModifier = () => {
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: COLORS.BLUE,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
          padding: '5px 5px',
        },
    }));
    
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    }));
    
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

    const [groupModifiers, setGroupModifiers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // State cho từ khóa tìm kiếm
    const [openModal, setOpenModal] = useState(false);
    const [selectedGroupModifier, setSelectedGroupModifier] = useState(null); // State lưu trữ thông tin nhóm đang chỉnh sửa

    useEffect(() => {
        fetchGroupModifiers(); // Fetch existing group modifiers
    }, []);

    const fetchGroupModifiers = async () => {
        try {
            const response = await GroupService.getAllGroupModifiers(); // Use GroupService to fetch group modifiers
            setGroupModifiers(response.data || []);
        } catch (error) {
            console.error("Failed to fetch group modifiers:", error);
            setGroupModifiers([]);
        }
    };

    const handleOpenModal = (group = null) => {
        setSelectedGroupModifier(group); // Đặt dữ liệu của nhóm được chọn (nếu có) vào state
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedGroupModifier(null); // Xóa dữ liệu nhóm đã chọn sau khi đóng modal
    };

    const handleSaveGroupModifier = async (groupData) => {
        await fetchGroupModifiers(); // Cập nhật lại danh sách group modifiers
        // try {
        //     if (selectedGroupModifier) {
        //         // Chỉnh sửa nhóm đã chọn
        //         await GroupService.updateGroupModifier(selectedGroupModifier.ID, groupData);
        //         toast.success("Group Modifier updated successfully.");
        //     } else {
        //         // Tạo mới một nhóm
        //         await GroupService.createGroupModifier(groupData);
        //         toast.success("Group Modifier created successfully.");
        //     }
        //     await fetchGroupModifiers(); // Cập nhật lại danh sách group modifiers
        //     handleCloseModal(); // Đóng modal sau khi lưu thành công
        // } catch (error) {
        //     console.error("Failed to save group modifier:", error);
        //     toast.error("Failed to save group modifier.");
        // }
    };

    const handleDeleteGroupModifier = async (id) => {
        try {
            await GroupService.deleteGroupModifier(id);
            setGroupModifiers(groupModifiers.filter((group) => group.ID !== id));
            toast.success("Group Modifier deleted successfully.");
        } catch (error) {
            console.error("Failed to delete group modifier:", error);
            toast.error("Failed to delete group modifier.");
        }
    };

    const filteredGroupModifiers = groupModifiers.filter((group) =>
        group.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>
                Group Modifier List
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal()}
            >
                Add Group Modifier
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
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>MinQty</StyledTableCell>
                            <StyledTableCell>MaxQty</StyledTableCell>
                            <StyledTableCell align="right">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredGroupModifiers.map((group) => (
                            <StyledTableRow key={group.ID}>
                                <StyledTableCell>{group.ID}</StyledTableCell>
                                <StyledTableCell>{group.Name}</StyledTableCell>
                                <StyledTableCell>{group.MinQty}</StyledTableCell>
                                <StyledTableCell>{group.MaxQty}</StyledTableCell>
                                <StyledTableCell align="right">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleOpenModal(group)}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDeleteGroupModifier(group.ID)}
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
                    <GroupModifierForm 
                        mode={selectedGroupModifier ? "edit" : "create"}
                        groupData={selectedGroupModifier}
                        onRefesh={handleSaveGroupModifier}
                        onClose={handleCloseModal}
                    />
                </Box>
            </Modal>
        
        </div>
    );
};

export default GrouptModifier;
