import React, { useState } from "react";
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Clear any tokens or user data from storage here if needed
    localStorage.removeItem("authToken");
  };

  return (
    <Router>
      <div>
        <header className="header">
          <Navbar variant="dark" expand="lg">
            <Container fluid>
              <Navbar.Brand>Dynamic Forms</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                  {isLoggedIn ? (
                    <>
                      <Nav.Link className="NavLink mx-1" as={Link} to="/add-user">
                        Add Users
                      </Nav.Link>
                      <Nav.Link className="NavLink mx-1" as={Link} to="/add-forms">
                        Add Forms
                      </Nav.Link>
                      <Nav.Link className="NavLink mx-1" as={Link} to="/view-forms">
                        View Forms
                      </Nav.Link>
                      <Nav.Link className="NavLink mx-1" as={Link} to="/view-user-filled-forms">
                        View User Filled Forms
                      </Nav.Link>
                      <Nav.Link className="NavLink mx-1" onClick={handleLogout} as={Link} to="/">
                        Logout
                      </Nav.Link>
                    </>
                  ) : (
                    <>
                      <Nav.Link className="NavLink mx-1" as={Link} to="/CompanyRegistration">
                        Company Registration
                      </Nav.Link>
                      <Nav.Link className="NavLink mx-1" as={Link} to="/CompanyLogin">
                        Company Login
                      </Nav.Link>
                    </>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/add-forms" element={<AddForms />} />
            <Route path="/view-forms" element={<ViewForms />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route path="/CompanyRegistration" element={<CompanyRegistration />} />
            <Route
              path="/CompanyLogin"
              element={<CompanyLogin setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/view-user-filled-forms" element={<ViewUserFilledForms />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
