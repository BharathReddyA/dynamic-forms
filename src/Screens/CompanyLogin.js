import React, { useState } from "react";
import "../App.css";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import Field from "../Components/Field.js";

export default function CompanyLogin() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company: "",
  });

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
    if (!formData.company) newErrors.company = "Company is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      fetch("http://127.0.0.1:8000/company_registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            company: "",
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
      company: "",
    });
    setErrors({});
  };

  return (
    <Container className="pt-5">
      <Card className="CustomCard">
        <h3 className="pb-5">Company Login</h3>
        <form onSubmit={handleSubmit}>
          <Field
            FieldName="Company ID"
            FieldType="text"
            name="companyID"
            value={formData.companyID}
            onChange={handleChange}
            error={errors.companyID}
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
            FieldName="Password"
            FieldType="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Row>
            <Col className="ButtonSection">
              <Button className="CustomButton M5" type="submit">
                Submit
              </Button>
              <Button
                className="CustomButton M5"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </form>
      </Card>
    </Container>
  );
}
