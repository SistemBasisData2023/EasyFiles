import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="#home" className="fs-3">
          <strong>EasyFiles</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login">
              <Button
                variant="outline-light"
                className="fw-bold login rounded-1"
              >
                Login
              </Button>
            </Nav.Link>
            <Nav.Link as={Link} to="/signup" eventKey={2}>
              <Button
                variant="light"
                className="text-primary fw-bold register rounded-1"
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
