//import "./App.css";
import React from "react";
import Navbar from "./component/NavBar";
import Login from "./component/Authentication/Login";
import Signup from "./component/Authentication/SignUp";
import Dashboard from "./component/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
