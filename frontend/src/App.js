//import "./App.css";
import React from "react";
import { Container } from "react-bootstrap";
import Login from "./component/Login";
import Signup from "./component/SignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
