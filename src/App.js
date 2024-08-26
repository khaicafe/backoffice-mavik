import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import AdminSetup from "./components/Auth/AdminSetup";
import ForgotPass from "./components/Auth/ForgotPassword";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import AddProduct from "./components/BackOffice/AddEditProductBBK";
import ProductsList from "./components/BackOffice/ProductsList";
import UserManagement from "./components/BackOffice/UserManagement";
import Dashboard from "./components/Dashboard/Dashboard";
import Layout from "./components/Dashboard/Layout";

// import Unauthorized from "./components/Unauthorized";
// Import ToastContainer và CSS từ react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from "./theme/theme";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/setup" element={<AdminSetup />} />
          <Route path="/forgotPass" element={<ForgotPass />} />
          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
          <Route element={<Layout />}>
            <Route element={<PrivateRoute roles={["admin"]} />}>
              <Route path="/user-management" element={<UserManagement />} />
            </Route>
            <Route element={<PrivateRoute roles={["admin"]} />}>
              <Route path="/products" element={<ProductsList />} />
            </Route>
            <Route element={<PrivateRoute roles={["admin"]} />}>
              <Route path="/add-product" element={<AddProduct/>} />
            </Route>
           
            <Route
              element={<PrivateRoute roles={["staff", "manager", "admin"]} />}
            >
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      {/* Thêm ToastContainer vào cuối cây component */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeProvider>
  );
}

export default App;
