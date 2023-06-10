import React from "react";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Files({ file }) {
  return (
    <a
      href={file.link}
      target="_blank"
      className="btn btn-outline-primary text-truncate w-100"
    >
      <FontAwesomeIcon icon={faFile} className="me-2" />
      {file.name}
    </a>
  );
}
