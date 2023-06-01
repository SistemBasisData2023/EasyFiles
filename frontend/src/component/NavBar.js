import React from "react";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import "../styles/Navbar.css";

export default function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="#home" className="fs-3">
          <strong>EasyFiles</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link href="/login">
              <Button
                variant="outline-light"
                className="fw-bold login rounded-5"
              >
                Login
              </Button>
            </Nav.Link>
            <Nav.Link eventKey={2} href="/signup">
              <Button
                variant="light"
                className="text-primary fw-bold register rounded-5"
              >
                Register
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
