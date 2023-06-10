import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function validateForm(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords don't match");
    }

    await axios
      .post("http://localhost:9999/register", {
        username: username,
        nama: name,
        password: password,
      })
      .then((response) => {
        if (response.data.message === "Registration succesful") {
          navigate("/login");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }
  console.log(username);
  console.log(name);
  console.log(password);

  return (
    <div className="bg-primary">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="w-100" style={{ maxWidth: "450px" }}>
          <Card className="p-4 rounded-4 shadow-lg">
            <h1 className="text-center mb-2 text-primary fw-bold fs-1 text-uppercase">
              Register
            </h1>
            {error && (
              <Alert
                variant="danger"
                className="text-center mb-0 py-2 rounded-3"
              >
                {error}
              </Alert>
            )}
            <Form onSubmit={validateForm}>
              <Form.Group controlId="formBasicUsername" className="mt-2">
                <Form.Label>
                  <strong>Username</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  className="rounded-3"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicName" className="mt-2">
                <Form.Label>
                  <strong>Name</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  className="rounded-3"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mt-2">
                <Form.Label>
                  <strong>Password</strong>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="******"
                  className="rounded-3"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicConfirmPassword" className="mt-2">
                <Form.Label>
                  <strong>Confirm Password</strong>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="******"
                  className="rounded-3"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>

              <Button
                variant="outline-primary"
                type="submit"
                className="w-100 mt-3 fw-semibold rounded-3"
              >
                Register
              </Button>
            </Form>
            <div className="w-100 text-center mt-1">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none ">
                Log In
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Register;
