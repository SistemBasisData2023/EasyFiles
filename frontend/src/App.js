//import "./App.css";
import React from "react";
import Login from "./component/Authentication/Login";
import Register from "./component/Authentication/Register";
import Dashboard from "./component/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/folder/:folderId" element={<Dashboard />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
