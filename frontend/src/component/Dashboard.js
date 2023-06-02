import React from "react";
import Navbar from "./NavBar";
import { Container } from "react-bootstrap";
import AddFolder from "./AddFolder";
import AddFiles from "./AddFiles";
import Filter from "./Filter";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <Container className="mt-1 bg-light">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h3>Dashboard</h3>
          </div>
          <div className="d-flex">
            <Filter />
            <AddFiles />
            <AddFolder />
          </div>
        </div>
      </Container>
    </>
  );
}
