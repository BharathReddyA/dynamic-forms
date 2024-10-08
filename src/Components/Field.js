import React from "react";
import { Row, Col, InputGroup, FormControl } from "react-bootstrap";

export default function Field({ FieldName, FieldType, name, value, onChange, error, disabled }) {
  return (
    <Row className="MX5">
      <Col lg={2}>
        <label>{FieldName}</label>
      </Col>
      <Col lg={7}>
        <InputGroup>
          <FormControl
            type={FieldType}
            placeholder={FieldName}
            aria-label={FieldName}
            className="form-control"
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        </InputGroup>
        {error && <p className="text-danger">{error}</p>}
      </Col>
    </Row>
  );
}
