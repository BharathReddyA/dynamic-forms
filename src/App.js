import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Screens/home";
import Admin from "./Screens/AdminDashboard";
import AddUser from "./Components/AddUser";
import AddForms from "./Components/AddForms";
import ViewForms from "./Components/ViewForms";
import ViewUserFilledForms from "./Components/ViewUserFilledForms";
import CompanyRegistration from "./Screens/CompanyRegistration";
import CompanyLogin from "./Screens/CompanyLogin";

function App() {
  return (
    <Router>
      <div>
        <header className="header">
          <Navbar variant="dark" expand="lg">
            <Container fluid>
              <Navbar.Brand>Dynamic Forms</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                  <Nav.Link as={Link} to="/">
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin">
                    Admin
                  </Nav.Link>
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
            <Route path="/CompanyRegistration" element={<CompanyRegistration />} />
            <Route path="/CompanyLogin" element={<CompanyLogin />} />
            <Route
              path="/view-user-filled-forms"
              element={<ViewUserFilledForms />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
