import React, { useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

function AddFields() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button className='CustomButton M5' onClick={handleShow}>
        Add Fields
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Define fields</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row className="MX5">
          {" "}
          <Col lg={3}>
            <label>Label name</label>
          </Col>
          <Col lg={7}>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
            />
          </Col>
        </Row>
        <Row className="MX5">
          {" "}
          <Col lg={3}>
            <label>Label type</label>
          </Col>
          <Col lg={7}>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
            />
          </Col>
        </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button className='CustomButton' onClick={handleClose}>
            Close
          </Button>
          <Button className='CustomButton' onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddFields;
