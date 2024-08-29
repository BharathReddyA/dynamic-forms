import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import "../App.css";
import { useSelector } from "react-redux";

export default function ProfilePage() {
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const companyId = useSelector((state) => state.company.companyId);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!companyId) {
        console.error("Company Id is undefined");
        return;
      }

      try {
        console.log("Fetching profile data for user ID:", companyId);
        const response = await axios.get(
          `http://127.0.0.1:8000/user_profile/${companyId}`
        );
        console.log("API response:", response.data);

        const userData = {
          fullName: `${response.data.first_name} ${response.data.last_name}`,
          companyName: response.data.company,
          phoneNumber: response.data.phone_number,
          email: response.data.email,
          companyId: response.data.company_id,
        };
        setFormData(userData);
        setOriginalData(userData);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchProfileData();
  }, [companyId]);

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
    if (!companyId) {
      console.error("Company ID is undefined");
      return;
    }

    const [first_name, ...last_name_parts] = formData.fullName.split(" ");
    const last_name = last_name_parts.join(" "); // In case last name has multiple parts

    const payload = {
      first_name: first_name,
      last_name: last_name,
      company: formData.companyName,
      phone_number: formData.phoneNumber,
      // Excluding company_id and email as they should not be updated
    };

    console.log("Payload to be sent:", payload);

    try {
      await axios.put(`http://127.0.0.1:8000/user_profile/${companyId}`, {
        first_name: formData.fullName.split(" ")[0],
        last_name: formData.fullName.split(" ")[1],
        company: formData.companyName,
        phone_number: formData.phoneNumber,
        email: formData.email,
      });
      setIsEditing(false);
      setOriginalData(formData);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  if (!formData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Container className="pt-5">
        <h1>Profile Page</h1>
        <Card className="CustomCard">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFullName" className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </Form.Group>

            <Form.Group controlId="formCompanyName" className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </Form.Group>

            <Form.Group controlId="formContactInfo" className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Email ID"
                    name="email"
                    value={formData.email}
                    disabled
                    required
                  />
                </Col>
              </Row>
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
                Edit Form
              </Button>
            )}
          </Form>
        </Card>
      </Container>
    </div>
  );
}
