import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

export default function AddFiles({ onAddFile }) {
  function handleUpload(e) {
    const newFile = {
      id: uuidv4(),
      name: e.target.files[0].name,
    };
    onAddFile(newFile);
  }
  return (
    <>
      <label className="btn btn-outline-primary btn-sm me-1">
        <FontAwesomeIcon icon={faFileCirclePlus} />
        <input
          type="file"
          onChange={handleUpload}
          style={{ position: "absolute", opacity: 0, left: "-9999px" }}
        />
      </label>
    </>
  );
}
