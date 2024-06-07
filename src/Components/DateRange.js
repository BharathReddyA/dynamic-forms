import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";

function DateRange() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/date_range", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        handleClose(); // Close the modal after successful submission
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Button className="CustomButton M5" onClick={handleShow}>
        Date Range
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Define Date Range</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Row className="MX5 mb-3">
              <Col lg={3}>
                <label>Start Date</label>
              </Col>
              <Col lg={7}>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>
            <Row className="MX5 mb-3">
              <Col lg={3}>
                <label>End Date</label>
              </Col>
              <Col lg={7}>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>
            <Modal.Footer>
              <Button className="CustomButton" onClick={handleClose}>
                Close
              </Button>
              <Button className="CustomButton" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DateRange;
