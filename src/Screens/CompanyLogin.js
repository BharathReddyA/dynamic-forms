import React, { useState } from "react";
import "../App.css";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import Field from "../Components/Field.js";
import { useNavigate } from "react-router-dom";

export default function CompanyLogin({ setIsLoggedIn }) { // Receive setIsLoggedIn from props
  const [formData, setFormData] = useState({
    companyID: "",
    email: "",
    password: "",
  });

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
    if (!formData.companyID) newErrors.companyID = "Company ID is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      fetch(`http://127.0.0.1:8000/login_user?company_id=${formData.companyID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Login failed"); // Handle HTTP errors
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
          setIsLoggedIn(true); // Update the login state in the parent component
          setFormData({
            companyID: "",
            email: "",
            password: "",
          });
          setErrors({});
          navigate("/"); // Redirect to the home page after successful login
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrors({ form: "Invalid login credentials" }); // Display a general error message
        });
    }
  };

  const handleCancel = () => {
    setFormData({
      companyID: "",
      email: "",
      password: "",
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
            FieldType="password"  // Secure password input
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          {errors.form && <p className="text-danger">{errors.form}</p>} {/* Display form-level error */}
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
