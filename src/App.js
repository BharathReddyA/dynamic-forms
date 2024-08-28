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
import ViewUserFilledForms from "./Components/ViewUserFilledForms";
import CompanyRegistration from "./Screens/CompanyRegistration";
import CompanyLogin from "./Screens/CompanyLogin";
import CompanyProfile from "./Screens/CompanyProfile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
  };

  return (
    <Router>
      <div className="app-layout">
        {isLoggedIn && (
          <nav className="side-nav">
            <Link to="/add-user">Add Users</Link>
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
                  <Nav.Link className="navLink" as={Link} to="/add-user">
                    Add Users
                  </Nav.Link>
                  <Nav.Link className="navLink" as={Link} to="/company-profile">
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
                  <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                }
              />
              <Route path="/admin" element={<Admin />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/add-forms" element={<AddForms />} />
              <Route path="/view-forms" element={<ViewForms />} />
              <Route path="/verify-account" element={<VerifyAccount />} />
              <Route path="/company-profile" element={<CompanyProfile />} />
              <Route
                path="/CompanyRegistration"
                element={<CompanyRegistration />}
              />
              <Route
                path="/CompanyLogin"
                element={<CompanyLogin setIsLoggedIn={setIsLoggedIn} />}
              />
              <Route
                path="/view-user-filled-forms"
                element={<ViewUserFilledForms />}
              />
            </Routes>
          </Container>
        </div>
      </div>
    </Router>
  );
}

export default App;
