import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";

const ViewForms = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [forms, setForms] = useState([]);

  const companyId = useSelector((state) => state.company.companyId);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/dynamic_forms_by_company_and_date",
        {
          params: {
            company_id: companyId,
            start_date: startDate,
            end_date: endDate,
          },
        }
      );
      console.log("API Response:", response.data);
      setForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  return (
    <div>
      <Container className="mt-5">
        <h1>View Forms by Date Range</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formDateRange" className="mb-3">
            <Row>
              <Col>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Col>
              <Col>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Col>
            </Row>
          </Form.Group>
          <Button variant="primary" type="submit">
            Search
          </Button>
        </Form>

        <h3 className="mt-4">Forms</h3>
        {forms.length > 0 ? (
          forms.map((form, index) => (
            <div key={index} className="mt-2">
              <strong>{form.title}</strong> ({form.description})
              <div>
                <strong>Fields:</strong>
                <ul>
                  {Object.entries(form.fields).map(
                    ([fieldName, fieldDetails]) => (
                      <li key={fieldName}>
                        {fieldName} ({fieldDetails.type})
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p>No forms found for the selected date range.</p>
        )}
      </Container>
    </div>
  );
};

export default ViewForms;
