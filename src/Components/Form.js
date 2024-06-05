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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          />
          <Field
            FieldName="Last name"
            FieldType="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
          <Field
            FieldName="Email"
            FieldType="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Field
            FieldName="Phone number"
            FieldType="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
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
