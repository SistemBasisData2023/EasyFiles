import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function validateForm(e) {
    e.preventDefault();
    //fetch data dari server.js di folder backend
    axios.defaults.withCredentials = true;
    await axios
      .post("http://localhost:9999/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.data.message === "Login succesful") {
          navigate("/");
        } else {
          setError(res.data);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
  console.log(username);
  console.log(password);

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
                <Form.Group controlId="formBasicUsername">
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

                <Button
                  variant="outline-primary"
                  type="submit"
                  className="w-100 mt-3 fw-semibold rounded-3"
                >
                  Login
                </Button>
              </Form>
              <div className="d-flex justify-content-between w-100 mt-1">
                <Link to="/register" className="text-decoration-none text-dark">
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
