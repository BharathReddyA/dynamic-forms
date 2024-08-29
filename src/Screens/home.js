import React, { useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../App.css";
import DashboardApps from "../Components/DashboardApps";

export default function Home({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by looking for the auth token
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={{ marginTop: 50 }}>
      {isLoggedIn ? (
        <>
          <Container>
            <Row className="mb-5">
              <Col>
                <Card className="p-4 text-center CustomCard">
                  <DashboardApps/>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <>
          <Container>
            <Row className="mb-5">
              <Col>
                <Card className="p-4 text-center CustomCard">
                  <h1>Welcome to Dynamic Forms</h1>
                  <p>
                    Our platform allows you to manage forms, collect data, and more. If you are a company, start by registering your organization or log in to manage your forms.
                  </p>
                  <p>Select an option below to get started!</p>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col className="text-center">
                <Button
                  className="CustomButton M5"
                  type="button"
                  onClick={() => handleNavigation("/CompanyRegistration")}
                >
                  Company Registration
                </Button>
                <Button
                  className="CustomButton M5"
                  type="button"
                  onClick={() => handleNavigation("/CompanyLogin")}
                >
                  Company Login
                </Button>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
}
