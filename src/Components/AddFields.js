import React, { useState } from 'react';
import { Modal, Button, FormControl, InputGroup, Form } from 'react-bootstrap';

const AddFieldModal = ({ show, handleClose, handleAddField }) => {
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('text');

  const onSubmit = (e) => {
    e.preventDefault();
    handleAddField(fieldName, fieldType);
    setFieldName('');
    setFieldType('text');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Field</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>Field Name</InputGroup.Text>
            <FormControl
              type="text"
              placeholder="Enter field name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Field Type</InputGroup.Text>
            <Form.Select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="tel">Phone Number</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              {/* Add more types as needed */}
            </Form.Select>
          </InputGroup>
          <Button type="submit">Add Field</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddFieldModal;
