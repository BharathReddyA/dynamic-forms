import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import FieldInput from './FieldInput';
import axios from 'axios';

const AddForms = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [companyId, setCompanyId] = useState('');

  const addField = (field) => {
    setFields([...fields, field]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = {
      title,
      description,
      fields: fields.reduce((acc, field) => ({ ...acc, [field.name]: { type: field.type } }), {}),
      date_range: { startDate, endDate },
      company_id: companyId,
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
      setCompanyId('');
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  return (
    <Container>
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
            placeholder="Enter company ID"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
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
    </Container>
  );
};

export default AddForms;