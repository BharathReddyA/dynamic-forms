import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import FieldInput from './FieldInput';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const AddForms = () => {
  const companyId = useSelector((state) => state.company.companyId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [apps, setApps] = useState([]);
  const location = useLocation();
  const { appId, appName } = location.state || {};
  const addField = (field) => {
    setFields([...fields, field]);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = {
      title,
      description,
      fields: fields.reduce((acc, field) => ({ ...acc, [field.name]: { type: field.type } }), {}),
      date_range: { startDate, endDate },
      company_id: companyId,
      app_name: appName,
      app_id: appId,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/dynamic_form', form);
      console.log('Form created successfully:', response.data);

      // Reset form fields to their initial values
      setTitle('');
      setDescription('');
      setFields([]);
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Error creating form:', error);
    }
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
    navigate("/add-forms", {
      state: { appId: selectedAppId, appName: selectedAppName },
    });
  };

  if (!appId) {
    return (
      <Container fluid className="p-5">
        <h3> Select an Application</h3>
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
                      View Forms
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
    <Container className="py-5">
      <Card className="CustomCard">
      <h1>Create Dynamic Form</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter form title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter form description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

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

        <Form.Group controlId="formCompanyId" className="mb-3">
          <Form.Label>Company ID</Form.Label>
          <Form.Control
            type="text"
            value={companyId}  
            disabled           
            required
          />
        </Form.Group>

        <Form.Group controlId="formCompanyId" className="mb-3">
          <Form.Label>Application Name</Form.Label>
          <Form.Control
            type="text"
            value={appName}  
            disabled          
            required
          />
        </Form.Group>

        <h3>Fields</h3>
        <FieldInput addField={addField} />
        {fields.map((field, index) => (
          <div key={index}>
            <strong>{field.name}</strong> ({field.type})
          </div>
        ))}

        <Button variant="primary" type="submit" className="mt-3">
          Create Form
        </Button>
      </Form>
      </Card>
    </Container>
  );
};

export default AddForms;
