import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UnauthorizedDialog from './components/Unauthorized';

const PrivateRoute = ({ roles }) => {
  const [unauthorized, setUnauthorized] = useState(false);
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    try {
        const decodedToken = jwtDecode(token);
        if (roles && decodedToken.role && roles.indexOf(decodedToken.role) === -1) {
          setUnauthorized(true);
        }
    } catch (err) {
        console.log("Invalid token:");
    }
   
  }, [roles]);

  
  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = jwtDecode(token);
  //const isAuthenticated = !!token;
//   const isAdmin = decodedToken.role === "admin";

  if (roles && roles.indexOf(decodedToken.role) === -1) {
    // setUnauthorized(true);
    return (
      <UnauthorizedDialog
        open={unauthorized}
        onClose={() => setUnauthorized(false)}
      />
    );
  }
  return <Outlet />;
};

export default PrivateRoute;
