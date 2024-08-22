import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Home() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={{ marginTop: 50 }}>
      <Container>
        {/* Landing Page Intro Section */}
        <Row className="mb-5">
          <Col>
            <Card className="p-4 text-center">
              <h1>Welcome to Dynamic Forms</h1>
              <p>
                Our platform allows you to manage forms, collect data, and more.
                If you are a company, start by registering your organization or log in to manage your forms.
              </p>
              <p>
                Select an option below to get started!
              </p>
            </Card>
          </Col>
        </Row>

        {/* Company Registration and Login Buttons */}
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
    </div>
  );
}
