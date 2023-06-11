import React from "react";
import { Button, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import "../styles/Filter.css";

export default function Filter({ onFilter }) {
  function handleOnClick(option) {
    onFilter(option);
  }

  return (
    <>
      <Dropdown className="me-1">
        <Dropdown.Toggle className="px-2 filter">
          <FontAwesomeIcon icon={faFilter} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            className="dropdown"
            onClick={() => handleOnClick("Sort Ascending")}
          >
            Sort by Name Ascending
          </Dropdown.Item>
          <Dropdown.Item
            className="dropdown"
            onClick={() => handleOnClick("Sort Descending")}
          >
            Sort by Name Descending
          </Dropdown.Item>
          <Dropdown.Item
            className="dropdown"
            onClick={() => handleOnClick("Sort Date Ascending")}
          >
            Sort by Date Ascending
          </Dropdown.Item>
          <Dropdown.Item
            className="dropdown"
            onClick={() => handleOnClick("Sort Date Descending")}
          >
            Sort by Date Descending
          </Dropdown.Item>
          <Dropdown.Item
            className="dropdown"
            onClick={() => handleOnClick("FreeAccess")}
          >
            Free Access
          </Dropdown.Item>
          <Dropdown.Item
            className="dropdown"
            onClick={() => handleOnClick("Own")}
          >
            Own
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
