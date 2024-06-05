import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Container } from "react-bootstrap";
import Home from "./Screens/home";

function App() {
  return (
    <div>
      <header className="header">
        <Container>
          <p>Dynamic forms</p>
        </Container>
      </header>
      <Container>
        <Home />
      </Container>
    </div>
  );
}

export default App;
