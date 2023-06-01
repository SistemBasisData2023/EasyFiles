import React from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="bg-primary">
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="w-100" style={{ maxWidth: "450px" }}>
            <Card className="p-4 rounded-4 shadow-lg">
              <h1 className="text-center mb-3 text-primary fw-bold fs-1 text-uppercase">
                Login
              </h1>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>
                    <strong>Email</strong>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="email@address.com"
                    className="rounded-3"
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
                  />
                </Form.Group>

                <Button
                  variant="outline-primary"
                  type="submit"
                  className="w-100 mt-3 fw-semibold rounded-3"
                >
                  Log in
                </Button>
              </Form>
              <div className="d-flex justify-content-between w-100 mt-1">
                <Link to="/" className="text-decoration-none text-dark">
                  Create an account
                </Link>
                <Link to="#" className="text-decoration-none">
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
