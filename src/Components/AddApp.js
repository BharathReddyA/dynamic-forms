import React, { useState } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";

const AddApp = () => {
  const companyId = useSelector((state) => state.company.companyId);
  const [appName, setAppName] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const appData = {
      app_name: appName,
      app_url: appUrl,
      company_id: companyId,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/add_app",
        appData
      );
      console.log("App added successfully:", response.data);
      setAppName("");
      setAppUrl("");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.detail);
      } else {
        console.error("Error adding app:", error);
      }
    }
  };

  const handleCancel = () => {
    setAppName("");
    setAppUrl("");
  };

  return (
    <Container className="pt-5">
      <Card className="CustomCard">
      <h1>Add New Application</h1>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formAppName" className="mb-3">
          <Form.Label>Application Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter application name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formAppUrl" className="mb-3">
          <Form.Label>Application URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter application URL"
            value={appUrl}
            onChange={(e) => setAppUrl(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCompanyId" className="mb-3">
          <Form.Label>Company ID</Form.Label>
          <Form.Control type="text" value={companyId} disabled required />
        </Form.Group>

        <Button variant="primary" type="submit" className="CustomButton M5">
          Add Application
        </Button>
        <Button
          className="CustomButton M5"
          type="button"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Form>
      </Card>
    </Container>
  );
};

export default AddApp;
