import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const ViewForms = () => {
  const [forms, setForms] = useState([]);
  const [apps, setApps] = useState([]);
  const location = useLocation();
  const { appId, appName } = location.state || {};
  const companyId = useSelector((state) => state.company.companyId);
  const navigate = useNavigate();

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
    navigate("/view-forms", {
      state: { appId: selectedAppId, appName: selectedAppName },
    });
  };

  if (!appId) {
    return (
      <Container fluid className="p-5">
        <h3> Select an Application to view created forms</h3>
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
    <div>
      <Container className="">
        <h1>Forms for Application: {appName}</h1>

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
          <p>No forms found for this application.</p>
        )}
      </Container>
    </div>
  );
};

export default ViewForms;
