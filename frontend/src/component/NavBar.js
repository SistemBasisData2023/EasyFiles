import React, { useEffect } from "react";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NavBar({ onSearch }) {
  const [search, setSearch] = React.useState("");
  const [auth, setAuth] = React.useState(false);
  const [user, setUser] = React.useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  useEffect(() => {
    const sendData = setTimeout(() => {
      onSearch(search);
    }, 500);
    return () => clearTimeout(sendData);
  }, [search]);

  const fetchData = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    axios.get(`http://localhost:9999/`, config).then((res) => {
      console.log(res.data);
      if (res.data.message === "Success") {
        setAuth(true);
        setUser(res.data.user);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleLogout() {
    localStorage.clear();
    setAuth(false);
    setUser("");
    navigate("/login");
  }

  console.log(search);

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="/" className="fs-3">
          <strong>EasyFiles</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Form>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search"
                  className="rounded-1 search-bar"
                  onChange={handleSearch}
                />
              </InputGroup>
            </Form>
          </Nav>
          {auth ? (
            <Nav className="ms-auto d-flex align-items-center">
              <h3 className="text-white text-uppercase fw-bold me-3 user">
                {user}
              </h3>

              <Button
                variant="light"
                className="fw-bold rounded-1 logout text-primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">
                <Button
                  variant="outline-light"
                  className="fw-bold login rounded-1"
                >
                  Login
                </Button>
              </Nav.Link>
              <Nav.Link as={Link} to="/register" eventKey={2}>
                <Button
                  variant="light"
                  className="text-primary fw-bold register rounded-1"
                >
                  Register
                </Button>
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
