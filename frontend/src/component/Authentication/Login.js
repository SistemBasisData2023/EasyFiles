import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function validateForm(e) {
    e.preventDefault();
  }

  return (
    <>
      <div className="bg-primary">
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="w-100" style={{ maxWidth: "450px" }}>
            <Card className="p-4 rounded-4 shadow-lg">
              <h1 className="text-center mb-3 text-primary fw-bold fs-1 text-uppercase">
                Login
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
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>
                    <strong>Email</strong>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="email@address.com"
                    className="rounded-3"
                    required
                    onChange={(e) => setEmail(e.target.value)}
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
                    onAbort={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="outline-primary"
                  type="submit"
                  className="w-100 mt-3 fw-semibold rounded-3"
                >
                  Login
                </Button>
              </Form>
              <div className="d-flex justify-content-between w-100 mt-1">
                <Link to="/signup" className="text-decoration-none text-dark">
                  Create an account
                </Link>
                <Link to="/" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Login;
