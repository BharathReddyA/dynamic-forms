import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component, isLoggedIn, ...rest }) => {
  return isLoggedIn ? Component : <Navigate to="/CompanyLogin" replace />;
};

export default PrivateRoute;