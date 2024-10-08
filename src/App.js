import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Screens/home";
import Admin from "./Screens/AdminDashboard";
import AddUser from "./Components/AddUser";
import AddForms from "./Components/AddForms";
import ViewForms from "./Components/ViewForms";
import VerifyAccount from "./Components/VerifyAccount";
import AddApp from "./Components/AddApp";
import ViewUserFilledForms from "./Components/ViewUserFilledForms";
import CompanyRegistration from "./Screens/CompanyRegistration";
import CompanyLogin from "./Screens/CompanyLogin";
import CompanyProfile from "./Screens/CompanyProfile";
import ViewApps from "./Screens/ViewApps";
import AppDetails from "./Screens/AppDetails";
import PrivateRoute from "./Components/PrivateRoute";

import { AuthProvider } from "./authContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // // const { isLoggedIn } = useAuth();

  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   if (token) {
  //     setIsLoggedIn(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   const handleStorageChange = (event) => {
  //     if (event.key === "authToken") {
  //       if (!event.newValue) {
  //         setIsLoggedIn(false);
  //       } else {
  //         setIsLoggedIn(true);
  //       }
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  //   localStorage.removeItem("authToken");
  //   window.location.href = "/CompanyLogin";
  // };

  const handleLogout = () => {
    // localStorage.removeItem("authToken");
    window.location.href = "/CompanyLogin";
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          {isLoggedIn && (
            <nav className="side-nav">
              <Link to="/">Home</Link>
              <Link to="/add-user">Add Users</Link>
              <Link to="/add-application">Add Application</Link>
              <Link to="/view-apps">View Apps</Link>
              <Link to="/add-forms">Add Forms</Link>
              <Link to="/view-forms">View Forms</Link>
              <Link to="/view-user-filled-forms">View User Filled Forms</Link>
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </nav>
          )}
          <div className="main-content">
            <div className="top-nav">
              <Navbar.Brand as={Link} to="/">
                Dynamic Forms
              </Navbar.Brand>
              <Nav className="ms-auto">
                {!isLoggedIn && (
                  <>
                    <Nav.Link
                      className="navLink"
                      as={Link}
                      to="/CompanyRegistration"
                    >
                      Company Registration
                    </Nav.Link>
                    <Nav.Link className="navLink" as={Link} to="/CompanyLogin">
                      Company Login
                    </Nav.Link>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    <Nav.Link className="navLink" as={Link} to="/">
                      Home
                    </Nav.Link>
                    <Nav.Link className="navLink" as={Link} to="/add-user">
                      Add Users
                    </Nav.Link>
                    <Nav.Link
                      className="navLink"
                      as={Link}
                      to="/company-profile"
                    >
                      Profile
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </div>

            <Container fluid>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      isLoggedIn={isLoggedIn}
                      setIsLoggedIn={setIsLoggedIn}
                    />
                  }
                />
                <Route path="/admin" element={<Admin />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />}>
                  <Route path="/add-user" element={<AddUser />} />
                  <Route path="/add-forms" element={<AddForms />} />
                  <Route path="/add-application" element={<AddApp />} />
                  <Route path="/view-forms" element={<ViewForms />} />
                  <Route path="/company-profile" element={<CompanyProfile />} />
                  <Route path="/view-apps" element={<ViewApps />} />
                  <Route path="/app-details/:appId" element={<AppDetails />} />
                  <Route
                    path="/view-user-filled-forms"
                    element={<ViewUserFilledForms />}
                  />
                </Route>

                {/* Public Routes */}
                <Route path="/verify-account" element={<VerifyAccount />} />
                <Route
                  path="/CompanyRegistration"
                  element={<CompanyRegistration />}
                />
                <Route
                  path="/CompanyLogin"
                  element={<CompanyLogin setIsLoggedIn={setIsLoggedIn} />}
                />
              </Routes>
            </Container>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
