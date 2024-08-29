import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../App.css";

export default function AppDetails() {
  const { appId } = useParams();
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAppData = async () => {
      if (!appId) {
        console.error("App ID is undefined");
        return;
      }

      try {
        console.log("Fetching app data for app ID:", appId);
        const response = await axios.get(`http://127.0.0.1:8000/view_app_details/${appId}`);
        console.log("API response:", response.data);

        const appData = {
          app_name: response.data.app_name,
          app_url: response.data.app_url,
          companyId: response.data.company_id,
        };
        setFormData(appData);
        setOriginalData(appData);
      } catch (error) {
        console.error("Failed to fetch app details", error);
      }
    };

    fetchAppData();
  }, [appId]);

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const payload = {
      app_name: formData.app_name,
      app_url: formData.app_url,
    };

    console.log("Payload to be sent:", payload);

    try {
      await axios.put(`http://127.0.0.1:8000/update_app/${appId}`, payload);
      setIsEditing(false);
      setOriginalData(formData);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.detail);
      } else {
        console.error("Error adding app:", error);
      }
    }
  };

  if (!formData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Container className="pt-5">
        <h1>Application Details</h1>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Card className="CustomCard">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formAppName" className="mb-3">
              <Form.Label>Application Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Application Name"
                name="app_name"
                value={formData.app_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </Form.Group>

            <Form.Group controlId="formAppUrl" className="mb-3">
              <Form.Label>Application URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Application URL"
                name="app_url"
                value={formData.app_url}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </Form.Group>

            <Form.Group controlId="formCompanyId" className="mb-3">
              <Form.Label>Company ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Company ID"
                name="companyId"
                value={formData.companyId}
                disabled
                required
              />
            </Form.Group>
            {isEditing ? (
              <>
                <Button variant="primary" type="submit" className="CustomButton M5">
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  className="CustomButton M5"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={handleEditToggle}
                className="CustomButton M5"
              >
                Edit Application
              </Button>
            )}
          </Form>
        </Card>
      </Container>
    </div>
  );
}
