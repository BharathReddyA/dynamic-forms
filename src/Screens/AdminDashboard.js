import React from "react";
import "../Assets/AdminDashboard.css";
import { Col, Container, Row, Button } from "react-bootstrap";
import "../App.css";

export default function AdminDashboard() {
  return (
    <div>
      <Container fluid>
        <Row className="p-3 headerAdmin">
          <Col lg={1} className="text-center">
            <Button className="CustomButton M5" type="button">
              Add Users
            </Button>
          </Col>
          <Col lg={1} className="text-center">
            <Button className="CustomButton M5" type="button">
              Add Forms
            </Button>
          </Col>
          <Col lg={1} className="text-center">
            <Button className="CustomButton M5" type="button">
              View Forms
            </Button>
          </Col>
          <Col lg={3}>
            <Button className="CustomButton M5" type="button">
              View User Filled Forms
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
