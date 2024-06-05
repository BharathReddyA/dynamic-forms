import React, { useState } from "react";
import "../App.css";
import {
  Card,
  Button,
  Row,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import AddFields from "./AddFields";
import DateRange from "./DateRange";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Field from "./Field";

export default function Form() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    location: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      fetch("http://127.0.0.1:8000/submit_form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div>
      <Card className="CustomCard">
        <Row style={{ marginBottom: 20 }}>
          <Col>
            <p>Welcome "Dynamic User"</p>
          </Col>
          <Col className="ButtonSection">
            <DateRange />
            <AddFields />
          </Col>
        </Row>
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
              <Button className="CustomButton M5" type="submit">Submit</Button>
              <Button className="CustomButton M5" type="button">Cancel</Button>
            </Col>
          </Row>
        </form>
      </Card>
    </div>
  );
}
