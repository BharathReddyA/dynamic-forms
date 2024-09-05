import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ViewAppUsers = ({appName}) => {
  const { appId } = useParams();
  const companyId = useSelector((state) => state.company.companyId);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Fetch the users for the selected application
  useEffect(() => {
    const fetchUsers = async () => {
      if (!appId || !companyId) {
        console.error("App ID or Company ID is undefined");
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/get_app_users`,
          {
            params: {
              company_id: companyId,
              app_id: appId,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrorMessage("Error fetching users for this application.");
      }
    };

    fetchUsers();
  }, [appId, companyId]);

  // Navigate to Add User component to add a new user
  const handleAddUsers = () => {
    navigate(`/add-user`, {
      state: { appId: appId, appName: appName }, // Passing appId and appName to AddUser
    });
  };

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (!users.length) {
    return (
      <div>
        <p>No Users added for this application</p>
        <Button onClick={handleAddUsers}>Add Users</Button>
      </div>
    );
  }

  return (
    <Container>
      <h3>Users for Application: {appName}</h3> {/* Display the appName */}
      <Button onClick={handleAddUsers}>Add Users</Button>
      <Row>
        {users.map((user, index) => (
          <Col key={index} lg={4} md={6} sm={12}>
            <Card className="mb-4 CustomCard">
              <p>{`${user.first_name} ${user.last_name}`}</p>
              <p>{user.email}</p>
              <p>{appName}</p> {/* Display the appName */}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ViewAppUsers;
