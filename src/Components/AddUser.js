import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, InputGroup, FormControl, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Field from "./Field";

export default function AddUser() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    location: "",
    app_name: "",
    app_id: "",
    company_id: "",
  });
  const companyId = useSelector((state) => state.company.companyId);
  const [apps, setApps] = useState([]);
  const { appId, appName } = location.state || {};
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\+?[1-9]\d{9}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number is invalid";
    }
    if (!formData.location) newErrors.location = "Location is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      fetch("http://127.0.0.1:8000/submit_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          app_id: appId,
          app_name: appName,
          company_id: companyId,
        }),
      })      
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            location: "",
            app_id: appId,
            app_name: appName,
            company_id: companyId,
          });
          setErrors({});
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      location: "",
    });
    setErrors({});
  };

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/view_apps/${companyId}`
        );
        console.log("Apps Response:", response.data);
        setApps(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    if (!appId && companyId) {
      fetchApps();
    }
  }, [companyId, appId]);

  const handleAppSelect = (selectedAppId, selectedAppName) => {
    navigate("/add-user", {
      state: { appId: selectedAppId, appName: selectedAppName },
    });
  };

  if (!appId) {
    return (
      <Container fluid className="p-5">
        <h3> Select an Application to create new form</h3>
        <div className="view-app-container">
          <Row>
            {apps.length > 0 ? (
              apps.map((app, index) => (
                <Card key={index} className="mb-3 dashboardApps">
                  <Card.Body>
                    <Card.Title>{app.app_name}</Card.Title>
                    <Button
                      variant="primary"
                      onClick={() => handleAppSelect(app.id, app.app_name)}
                      className="AppUrlButton"
                    >
                      Select Application
                    </Button>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No applications found.</p>
            )}
          </Row>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pt-5">
      <Card className="CustomCard">
        <h3 className="pb-5">User Onboarding</h3>
        <form onSubmit={handleSubmit}>
          <Field
            FieldName="First name"
            FieldType="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
          />
          <Field
            FieldName="Last name"
            FieldType="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
          />
          <Field
            FieldName="Email"
            FieldType="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            FieldName="Phone number"
            FieldType="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            error={errors.phone_number}
          />
          <Field
            FieldName="App Name"
            FieldType="text"
            name="app_name"
            value={appName}
            disabled
            error={errors.app_name}
          />
          {/* <Field
            FieldName="App ID"
            FieldType="text"
            name="app_id"
            value={appId}
            disabled
            error={errors.app_id}
          />
          <Field
            FieldName="Company ID"
            FieldType="text"
            name="company_id"
            value={companyId}
            disabled
            error={errors.company_id}
          /> */}
          <Row className="MX5">
            <Col lg={2}>
              <label>Location</label>
            </Col>
            <Col lg={7}>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faLocationDot} />
                </InputGroup.Text>
                <FormControl
                  type="text"
                  placeholder="Location"
                  aria-label="Location"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </InputGroup>
              {errors.location && <p className="text-danger">{errors.location}</p>}
            </Col>
          </Row>
          <Row>
            <Col className="ButtonSection">
              <Button className="CustomButton M5" type="submit">
                Submit
              </Button>
              <Button className="CustomButton M5" type="button" onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </form>
      </Card>
    </Container>
  );
}
