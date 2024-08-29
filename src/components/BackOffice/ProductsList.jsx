import {
  Button,
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
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate
import { toast } from "react-toastify";
import productService from "../../services/ProductService"; // Sử dụng dịch vụ sản phẩm
import { COLORS } from '../../theme/themeColor';

  
  const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // State cho danh sách sản phẩm đã lọc
    const [searchTerm, setSearchTerm] = useState(""); // State cho từ khóa tìm kiếm
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 0 });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Thay thế useHistory bằng useNavigate

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
      const fetchProducts = async () => {
        const response = await productService.getAllProducts();
        console.log("Products", response.data);
        setProducts(response.data);
        if (response.data) {
            setFilteredProducts(response.data); // Ban đầu hiển thị tất cả sản phẩm
            }
        };
      fetchProducts();
    }, []);
  
    // Hàm để lọc sản phẩm dựa trên từ khóa tìm kiếm
    useEffect(() => {
        if (products) {
            const results = products.filter(product =>
                Object.values(product).some(
                  value =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                )
              );
              setFilteredProducts(results);
        }
     
    }, [searchTerm, products]);
  
    const handleAddProduct = async () => {
        navigate("/add-product"); // Điều hướng đến màn hình thêm sản phẩm
    };

    const handleEditProduct = async (id) => {
      navigate(`/add-product/${id}`); // Điều hướng đến màn hình thêm sản phẩm
  };
  
    const handleDeleteProduct = async (ID) => {
      try {
        await productService.deleteProduct(ID);
        setProducts(products.filter(product => product.ID !== ID));
        setFilteredProducts(filteredProducts.filter(product => product.ID !== ID)); // Cập nhật danh sách đã lọc
        toast.success("Product deleted successfully.");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.");
      }
    };
  
    return (
      <div style={{ width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Product Management
        </Typography>
  
        {/* Tạo hàng ngang với nút "Add Product" và ô tìm kiếm */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddProduct()}
          >
            Add Product
          </Button>
  
          {/* TextField cho tìm kiếm */}
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
                <StyledTableCell>price</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index}</StyledTableCell>
                  <StyledTableCell> <img src={product.image_link_square} alt={product.image_link_square} style={{ width: 100 }} /></StyledTableCell>
                  <StyledTableCell>{product.name}</StyledTableCell>
                  <StyledTableCell>{product.description}</StyledTableCell>
                  <StyledTableCell>{product.currency} {product.price}</StyledTableCell>
                  <StyledTableCell>{product.type}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="outlined"
                      onClick={() => handleEditProduct(product.ID)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteProduct(product.ID)}
                    >
                      Delete
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        
      </div>
    );
  };
  
  export default ProductManagement;
  