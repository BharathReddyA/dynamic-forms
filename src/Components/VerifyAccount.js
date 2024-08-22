import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import Field from "../Components/Field.js";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyAccount({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({
    email: "",
    verification_code: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email;
  const [errors, setErrors] = useState({});

  // Pre-populate the email field with the email passed from the registration page
  useEffect(() => {
    if (emailFromState) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: emailFromState,
      }));
    }
  }, [emailFromState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.verification_code)
      newErrors.verification_code = "Verification code is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Form data", formData);
      fetch("http://127.0.0.1:8000/verify_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          verification_code: formData.verification_code,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setFormData({
            email: "",
            verification_code: "",
          });
          setErrors({});
          // Redirect to home page after successful verification
          navigate("/");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <Container className="pt-5">
      <Card className="CustomCard">
        <h3 className="pb-5">Verify Account</h3>
        <form onSubmit={handleSubmit}>
          <Field
            FieldName="Email"
            FieldType="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            FieldName="Verification Code"
            FieldType="text"
            name="verification_code"
            value={formData.verification_code}
            onChange={handleChange}
            error={errors.verification_code}
          />
          <Row>
            <Col className="ButtonSection">
              <Button className="CustomButton M5" type="submit">
                Verify
              </Button>
            </Col>
          </Row>
        </form>
      </Card>
    </Container>
  );
}
