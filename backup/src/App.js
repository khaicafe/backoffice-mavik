import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Audiorecord from "./components/AudioRecorder";
import AdminSetup from "./components/Auth/AdminSetup";
import ForgotPass from "./components/Auth/ForgotPassword";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import UserManagement from "./components/BackOffice/UserManagement";
import BrandList from "./components/BrandList";
import CurrencyList from "./components/CurrencyList";
import Dashboard from "./components/Dashboard/Dashboard";
import Layout from "./components/Dashboard/Layout";
import FlavourNoteList from "./components/FlavourNoteList";
import IngredientForm from "./components/IngredientForm";
import IngredientList from "./components/IngredientList";
import MeasurementList from "./components/MeasurementList";
import RecipeForm from "./components/RecipeForm";
import RecipeList from "./components/RecipeList";
import RecipeNutritionList from "./components/RecipeNutritionList";
import RecipeTypeList from "./components/RecipeTypeList";
import SupplierList from "./components/SupplierList";
import Unauthorized from "./components/Unauthorized";
import FinalProductForm from "./components/FinalProductForm";
import FinalProductList from "./components/FinalProductList";
import theme from "./theme/theme";
import RecipeSearch from "./components/RecipeSearch";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/setup" element={<AdminSetup />} />
          <Route path="/forgotPass" element={<ForgotPass />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route element={<Layout />}>
            <Route element={<PrivateRoute roles={["admin"]} />}>
              <Route path="/user-management" element={<UserManagement />} />
            </Route>
            <Route
              element={<PrivateRoute roles={["staff", "manager", "admin"]} />}
            >
              <Route path="/final-products" element={<FinalProductList />} />
              <Route
                path="/final-product-form/:id"
                element={<FinalProductForm />}
              />
              <Route
                path="/final-product-form"
                element={<FinalProductForm />}
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/ingredient-form/:id?"
                element={<IngredientForm />}
              />
              <Route path="/ingredients" element={<IngredientList />} />
              <Route path="/currencies" element={<CurrencyList />} />
              <Route path="/recipe-type" element={<RecipeTypeList />} />
              <Route
                path="/recipe-nutrition"
                element={<RecipeNutritionList />}
              />
              <Route path="/measurements" element={<MeasurementList />} />
              <Route path="/suppliers" element={<SupplierList />} />
              <Route path="/brands" element={<BrandList />} />
              <Route path="/flavour-notes" element={<FlavourNoteList />} />
              <Route path="/recipe-form/:id?" element={<RecipeForm />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/recipe-search" element={<RecipeSearch />} />
              <Route path="/audio" element={<Audiorecord />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
