import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row } from "react-bootstrap";
import axios from "axios";
import "../App.css";
import { useSelector } from "react-redux";

export default function DashboardApps() {
  const [apps, setApps] = useState([]);
  const companyId = useSelector((state) => state.company.companyId);

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

  if (!apps.length) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Container className="pt-5">
        <h1>Applications</h1>
        <div className="app-container">
          <Row className="flex-row flex-nowrap">
            {apps.map((app, index) => (
              <Card key={index} className="mb-3 dashboardApps">
                <Card.Body>
                  <Card.Title>{app.app_name}</Card.Title>
                  <Button
                    variant="primary"
                    onClick={() => window.open(app.app_url, "_blank")}
                    className="AppUrlButton"
                  >
                    Open Application
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
