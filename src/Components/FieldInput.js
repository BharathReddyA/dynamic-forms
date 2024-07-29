import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';

const FieldInput = ({ addField }) => {
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('text');

  const handleAddField = () => {
    addField({ name: fieldName, type: fieldType });
    setFieldName('');
    setFieldType('text');
  };

  return (
    <Row className="mb-3">
      <Col>
        <Form.Control
          type="text"
          placeholder="Field Name"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
        />
      </Col>
      <Col>
        <Form.Select
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="textarea">Textarea</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          {/* Add more field types as needed */}
        </Form.Select>
      </Col>
      <Col>
        <Button onClick={handleAddField}>Add Field</Button>
      </Col>
    </Row>
  );
};

export default FieldInput;
