import React from "react";
import { Button, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import "../styles/Filter.css";

export default function Filter() {
  return (
    <>
      <Dropdown className="me-1">
        <Dropdown.Toggle className="px-2 filter">
          <FontAwesomeIcon icon={faFilter} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item className="dropdown">
            Sort by Size Ascending
          </Dropdown.Item>
          <Dropdown.Item className="dropdown">
            Sort by Size Descending
          </Dropdown.Item>
          <Dropdown.Item className="dropdown">
            Sort by Date Ascending
          </Dropdown.Item>
          <Dropdown.Item className="dropdown">
            Sort by Date Descending
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
