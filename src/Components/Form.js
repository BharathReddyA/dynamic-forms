import React, { useState, useEffect } from "react";
import "../App.css";
import { Card, Button, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import AddFieldModal from "./AddFields"; // Ensure the correct import path
import DateRange from "./DateRange"; // Ensure the correct import path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Field from "./Field"; // Ensure the correct import path

export default function Form({ role }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    location: "",
    role: role,
    dynamic_fields: {},
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetch(
        `http://127.0.0.1:8000/get_fields_by_date_range?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to load fields");
          }
        })
        .then((fields) => {
          setDynamicFields(fields);
          const newDynamicData = {};
          fields.forEach((field) => {
            newDynamicData[field.name] = "";
          });
          setFormData((prevFormData) => ({
            ...prevFormData,
            dynamic_fields: newDynamicData,
          }));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [dateRange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (dynamicFields.some((field) => field.name === name)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        dynamic_fields: { ...prevFormData.dynamic_fields, [name]: value },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleAddField = (name, type) => {
    const newField = { name, type };
    setDynamicFields([...dynamicFields, newField]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      dynamic_fields: { ...prevFormData.dynamic_fields, [name]: "" },
    }));

    // Save the dynamic field to the database
    fetch("http://127.0.0.1:8000/save_date_range", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...dateRange,
        fields: [...dynamicFields, newField],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Dynamic field saved:", data);
      })
      .catch((error) => {
        console.error("Error saving dynamic field:", error);
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
    // Validate dynamic fields
    dynamicFields.forEach((field) => {
      if (!formData.dynamic_fields[field.name]) {
        newErrors[field.name] = `${field.name} is required`;
      }
    });
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
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            location: "",
            role: role, 
            dynamic_fields: {},
          });
          setDynamicFields([]);
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
      role: role,
      dynamic_fields: {},
    });
    setDynamicFields([]);
    setErrors({});
  };

  return (
    <div>
      <Card className="CustomCard">
        {role === "Admin" && (
          <Row style={{ marginBottom: 20 }}>
            <Col></Col>
            <Col className="ButtonSection">
              <DateRange setDateRange={setDateRange} />
              <Button onClick={() => setShowModal(true)} className="CustomButton M5">
                Add Fields
              </Button>
            </Col>
          </Row>
        )}
        <form onSubmit={handleSubmit}>
          {role}
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
          {dynamicFields.map((field) => (
            <Field
              key={field.name}
              FieldName={field.name}
              FieldType={field.type}
              name={field.name}
              value={formData.dynamic_fields[field.name]}
              onChange={handleChange}
              error={errors[field.name]}
            />
          ))}
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
      <AddFieldModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleAddField={handleAddField}
      />
    </div>
  );
}
