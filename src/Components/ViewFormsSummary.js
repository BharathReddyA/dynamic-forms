import React, { useState, useEffect } from "react";
import { Card, Container, Button, Row } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewFormsSummary = ({ appId, appName }) => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  const companyId = useSelector((state) => state.company.companyId);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/dynamic_forms_by_app",
          {
            params: {
              company_id: companyId,
              app_id: appId,
            },
          }
        );
        console.log("API Response:", response.data);
        setForms(response.data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    if (appId && companyId) {
      fetchForms();
    }
  }, [appId, companyId]);

  const handleOpenForm = (formId) => {
    navigate(`/view-forms`, { state: { companyId, appId, formId } });
  };

  return (
    <div>
      <Container className="">
        <h4>Forms for Application: {appName}</h4>
        <div className="app-container">
          <Row className="flex-row flex-nowrap">
            {forms.length > 0 ? (
              forms.map((form, index) => (
                <div key={index} className="mt-2">
                  <Card className="mb-3 dashboardApps">
                    <Card.Body>
                      <Card.Title>{form.title}</Card.Title>
                      <p>({form.description})</p>
                      <Button
                        variant="primary"
                        onClick={() => handleOpenForm(form._id)}
                        className="AppUrlButton"
                      >
                        Open Form
                      </Button>
                    </Card.Body>
                  </Card>
                  <div></div>
                </div>
              ))
            ) : (
              <p>No forms found for this application.</p>
            )}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default ViewFormsSummary;
