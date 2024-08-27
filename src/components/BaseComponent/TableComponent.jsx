import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText,
  DialogTitle,
  Paper, Table, TableBody,
  TableCell, TableContainer, TableHead,
  TablePagination,
  TableRow, TextField,
  Typography,
  tableCellClasses
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../theme/themeColor';

const TableComponent = ({ title, column, datas, onAddRow, onEditRow, onDeleteRow }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentEditRow, setCurrentEditRow] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [newValues, setNewValues] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(""); // State cho từ khóa tìm kiếm
  const [data, setdata] = useState([]); // State cho danh sách sản phẩm đã lọc


   // Hàm để lọc sản phẩm dựa trên từ khóa tìm kiếm
   useEffect(() => {
    if (datas) {
        const results = datas.filter(item =>
            Object.values(item).some(
              value =>
                typeof value === "string" &&
                value.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
          setdata(results);
    }
 
}, [searchTerm, datas]);

  const capitalizeFirstLetter = (string) => {
    if (!string) return ''; // Kiểm tra chuỗi rỗng
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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

  const openEditDialog = (index) => {
    setCurrentEditRow(index);
    setEditValues(data[index]);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentEditRow(null);
    setEditValues({});
  };

  const handleEditChange = (column, value) => {
    setEditValues({
      ...editValues,
      [column]: value,
    });
  };

  const saveEdit = () => {
    onEditRow(currentEditRow, editValues);
    closeEditDialog();
  };

  // add row
  const openAddDialog = () => {
    setNewValues({});
    setAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
    setNewValues({});
  };
  const handleAddChange = (column, value) => {
    setNewValues({
      ...newValues,
      [column]: value,
    });
  };
  const saveNewRow = () => {
    onAddRow(newValues);
    closeAddDialog();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const hiddenFields = ['id', 'created_at', 'updated_at', 'deleted_at'];
  // lọc 'id', 'created_at', 'updated_at', 'deleted_at'
  const columns = column.filter(columns => !hiddenFields.includes(columns.toLowerCase()));
  // console.log(columns)
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <div style={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>{title}</Typography>
       {/* Tạo hàng ngang với nút "Add Product" và ô tìm kiếm */}
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Button variant="contained" color="primary" style={{ marginBottom: '10px' }} onClick={openAddDialog}>Add Row</Button>
          {/* TextField cho tìm kiếm */}
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }} // Đặt độ rộng cho TextField tìm kiếm
          />
        </div>
      <TableContainer component={Paper} style={{ maxHeight: '68vh' }}>
        <Table stickyHeader>
          <TableHead>
           
            {title === "Formula Table" ? (
              <>
               <TableRow>
                <StyledTableCell rowSpan={2} >Type</StyledTableCell>
                <StyledTableCell colSpan={2} align="center">Sugars %</StyledTableCell>
                <StyledTableCell colSpan={2} align="center">Fat %</StyledTableCell>
                <StyledTableCell colSpan={2} align="center">MSNF %</StyledTableCell>
                <StyledTableCell colSpan={2} align="center">Other Solids</StyledTableCell>
                <StyledTableCell colSpan={2} align="center">Total Solids %</StyledTableCell>
                <StyledTableCell rowSpan={2} align="right">Actions</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>min</StyledTableCell>
                <StyledTableCell>max</StyledTableCell>
                <StyledTableCell>min</StyledTableCell>
                <StyledTableCell>max</StyledTableCell>
                <StyledTableCell>min</StyledTableCell>
                <StyledTableCell>max</StyledTableCell>
                <StyledTableCell>min</StyledTableCell>
                <StyledTableCell>max</StyledTableCell>
                <StyledTableCell>min</StyledTableCell>
                <StyledTableCell>max</StyledTableCell>
              </TableRow>
              </>
            ): (
              <>
               <TableRow>
                {columns.map((column, index) => (
                  <StyledTableCell key={index}>{capitalizeFirstLetter(column)}</StyledTableCell>
                ))}
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
              </>
            )}
              
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : data
            ).map((row, rowIndex) => (
              <StyledTableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>{row[column]}</TableCell>
                ))}
                <TableCell align="right">
                  <Button color="primary" onClick={() => openEditDialog(page * rowsPerPage + rowIndex)}>Edit</Button>
                  <Button color="secondary" onClick={() => onDeleteRow(page * rowsPerPage + rowIndex)}>Delete</Button>
                </TableCell>
              </StyledTableRow>
            ))}
            {emptyRows > 0 && (
              <StyledTableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={columns.length + 1} />
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
       {/* Dialog chỉnh sửa */}
       <Dialog open={editDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Edit Row</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the fields below and click save to update the row.
          </DialogContentText>
          {columns.map((column, index) => (
            <TextField
              key={index}
              margin="dense"
              label={capitalizeFirstLetter(column)}
              type="text"
              fullWidth
              value={editValues[column] || ''}
              onChange={(e) => handleEditChange(column, e.target.value)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={saveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm hàng mới */}
      <Dialog open={addDialogOpen} onClose={closeAddDialog}>
        <DialogTitle>Add New Row</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the fields below and click save to add a new row.
          </DialogContentText>
          {columns.map((column, index) => (
            <TextField
              key={index}
              margin="dense"
              label={capitalizeFirstLetter(column)}
              type="text"
              fullWidth
              value={newValues[column] || ''}
              onChange={(e) => handleAddChange(column, e.target.value)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={saveNewRow} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TableComponent;
