import {
  Button,
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate
import { toast } from "react-toastify";
import productService from "../../services/productService"; // Sử dụng dịch vụ sản phẩm
  
  const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // State cho danh sách sản phẩm đã lọc
    const [searchTerm, setSearchTerm] = useState(""); // State cho từ khóa tìm kiếm
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 0 });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Thay thế useHistory bằng useNavigate
  
    useEffect(() => {
      // const fetchProducts = async () => {
      //   // const response = await productService.getAllProducts();
      //   // console.log("Products", response.data);
      //   setProducts(response.data);
      //   if (response.data) {
      //       setFilteredProducts(response.data); // Ban đầu hiển thị tất cả sản phẩm
      //       }
      //   };
      // fetchProducts();
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
  
    const handleProductSelect = (product) => {
      setSelectedProduct(product);
    };
  
    const handleAddProduct = async () => {
        navigate("/add-product"); // Điều hướng đến màn hình thêm sản phẩm
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
      <Container>
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
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{index}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.type}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleProductSelect(product)}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        {selectedProduct && (
          <Container>
            <Typography variant="h6" gutterBottom>
              Edit Product
            </Typography>
            <TextField
              label="Name"
              value={selectedProduct.name}
              fullWidth
              margin="normal"
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
            />
            <TextField
              label="Description"
              value={selectedProduct.description}
              fullWidth
              margin="normal"
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, description: e.target.value })
              }
            />
            <TextField
              label="Price"
              value={selectedProduct.price}
              fullWidth
              margin="normal"
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, price: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProduct} // Thêm hành động cập nhật sản phẩm
            >
              Save Changes
            </Button>
          </Container>
        )}
  
        {/* Dialog để thêm sản phẩm mới */}
        <Dialog
          open={openAddProductDialog}
          onClose={() => setOpenAddProductDialog(false)}
        >
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              fullWidth
              margin="dense"
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddProductDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddProduct} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  };
  
  export default ProductManagement;
  