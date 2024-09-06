import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";
// import { useSelector } from "react-redux";
import ViewFormsSummary from "../Components/ViewFormsSummary";
import ViewAppUsers from "../Components/ViewAppUsers";

export default function AppDetails() {
  const { appId } = useParams();
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  // const companyId = useSelector((state) => state.company.companyId);

  useEffect(() => {
    const fetchAppData = async () => {
      if (!appId) {
        console.error("App ID is undefined");
        return;
      }

      try {
        console.log("Fetching app data for app ID:", appId);
        const response = await axios.get(
          `http://127.0.0.1:8000/view_app_details/${appId}`
        );
        console.log("API response:", response.data);

        const appData = {
          app_name: response.data.app_name,
          app_url: response.data.app_url,
          companyId: response.data.company_id,
        };
        setFormData(appData);
        setOriginalData(appData);
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to fetch app details", error);
      }
    };

    fetchAppData();
  }, [appId]);

  const handleEditToggle = () => {
    setIsEditing(true);
    setErrorMessage("");
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setErrorMessage("");
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
      setErrorMessage("");
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

  const handleAddForm = (app) => {
    navigate(`/add-forms`, {
      state: { appId: appId, appName: formData.app_name },
    });
  };
  const handleMenuAddUser = (app) => {
    navigate(`/add-user`, {
      state: { appId: appId, appName: formData.app_name },
    });
  };

  const handleViewForms = (app) => {
    navigate(`/view-forms`, {
      state: { appId: appId, appName: formData.app_name },
    });
  };

  return (
    <div>
      <Container fluid className="pt-5">
        <Row>
          <Col lg={5}>
            <h4>Application Details for "{formData.app_name}"</h4>
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
                    <Button
                      variant="primary"
                      type="submit"
                      className="CustomButton M5"
                    >
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
                  <>
                    <Button
                      variant="primary"
                      onClick={handleEditToggle}
                      className="CustomButton M5"
                    >
                      Edit Application
                    </Button>
                  </>
                )}
              </Form>
            </Card>
          </Col>
          {/* <Col sm={1}></Col> */}
          <Col lg={3}>
            <h4>Functions for "{formData.app_name}"</h4>
            <Card className="CustomCard">
              <Button variant="primary" className="CustomButton M5">
                Open Application
              </Button>
              <Button
                variant="primary"
                onClick={() => handleAddForm(formData)}
                className="CustomButton M5"
              >
                Add Forms
              </Button>
              <Button
                variant="primary"
                onClick={() => handleViewForms(formData)}
                className="CustomButton M5"
              >
                View Created Forms
              </Button>
              <Button variant="primary" className="CustomButton M5">
                View Approved Forms
              </Button>
              <Button variant="primary" className="CustomButton M5" onClick={handleMenuAddUser}>
                Add Users
              </Button>
            </Card>
          </Col>
          {/* <Col lg={1}></Col> */}
          <Col lg={3} className="mx-2">
            <h4>Number of forms created for "{formData.app_name}"</h4>
            <Card className="CustomCard mb-3 text-center">
              <h1>20</h1>
            </Card>
            <h4>Number of forms filled for "{formData.app_name}"</h4>
            <Card className="CustomCard text-center">
              <h1>10</h1>
            </Card>
          </Col>
        </Row>
        <Row className="py-4">
          <Col lg={5}>
            <Card className="CustomCard">
              <ViewAppUsers appName={formData.app_name} />
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="CustomCard mt-4">
              <ViewFormsSummary appId={appId} appName={formData.app_name} />
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
