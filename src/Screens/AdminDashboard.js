import React from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/AdminDashboard.css";
import { Col, Container, Row, Button } from "react-bootstrap";
import "../App.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const navigateToAddUser = () => {
    navigate("/add-user");
  };

  const navigateToAddForms = () => {
    navigate("/add-forms");
  };

  const navigateToViewForms = () => {
    navigate("/view-forms");
  };

  const navigateToViewUserFilledForms = () => {
    navigate("/view-user-filled-forms");
  };

  return (
    <div>
      <Container fluid>
        <Row className="p-3 headerAdmin">
          <Col lg={1} className="text-center">
            <Button className="CustomButton M5" type="button" onClick={navigateToAddUser}>
              Add Users
            </Button>
          </Col>
          <Col lg={1} className="text-center">
            <Button className="CustomButton M5" type="button" onClick={navigateToAddForms}>
              Add Forms
            </Button>
          </Col>
          <Col lg={1} className="text-center">
            <Button className="CustomButton M5" type="button" onClick={navigateToViewForms}>
              View Forms
            </Button>
          </Col>
          <Col lg={3}>
            <Button className="CustomButton M5" type="button" onClick={navigateToViewUserFilledForms}>
              View User Filled Forms
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
