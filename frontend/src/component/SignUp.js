import React from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <>
      <div className="bg-primary">
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="w-100" style={{ maxWidth: "450px" }}>
            <Card className="p-4 rounded-4 shadow-lg">
              <h1 className="text-center mb-4 text-primary fw-bold fs-1 text-uppercase">
                Register
              </h1>
              <Form>
                <Form.Group controlId="formBasicUsername">
                  <Form.Label>
                    <strong>Username</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    className="rounded-3"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mt-2">
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

                <Form.Group
                  controlId="formBasicConfirmPassword"
                  className="mt-2"
                >
                  <Form.Label>
                    <strong>Confirm Password</strong>
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
    </>
  );
};

export default Signup;