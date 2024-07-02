import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "../Components/Form"; // Ensure the correct import path
import "../App.css";

export default function Home() {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleButtonClick = (role) => {
    setSelectedRole(role);
  };

  return (
    <div style={{ marginTop: 50 }}>
      <Container>
        <Row>
          <Col>
            <Button
              className="CustomButton M5"
              type="button"
              onClick={() => handleButtonClick("Admin")}
            >
              Admin
            </Button>
            <Button
              className="CustomButton M5"
              type="button"
              onClick={() => handleButtonClick("User")}
            >
              User
            </Button>
          </Col>
        </Row>
        <p></p>
        {selectedRole && <Form role={selectedRole} />}
      </Container>
    </div>
  );
}
