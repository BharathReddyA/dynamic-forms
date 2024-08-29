import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { useSelector } from "react-redux";

export default function ViewApps() {
  const [apps, setApps] = useState([]);
  const companyId = useSelector((state) => state.company.companyId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppsData = async () => {
      if (!companyId) {
        console.error("Company ID is undefined");
        return;
      }

      try {
        console.log("Fetching apps data for company ID:", companyId);
        const response = await axios.get(
          `http://127.0.0.1:8000/view_apps/${companyId}`
        );
        console.log("API response:", response.data);
        setApps(response.data);
      } catch (error) {
        console.error("Failed to fetch apps", error);
      }
    };

    fetchAppsData();
  }, [companyId]);

  const handleAppClick = (app) => {
    // Navigate to the AppDetails page, passing the app ID as a route parameter
    navigate(`/app-details/${app.id}`);
  };

  if (!apps.length) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Container fluid className="p-5">
        <h3>Applications</h3>
        <div className="view-app-container">
          <Row>
            {apps.map((app, index) => (
              <Card key={index} className="mb-3 dashboardApps">
                <Card.Body>
                  <Card.Title>{app.app_name}</Card.Title>
                  <Button
                    variant="primary"
                    onClick={() => handleAppClick(app)}
                    className="AppUrlButton"
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
}
