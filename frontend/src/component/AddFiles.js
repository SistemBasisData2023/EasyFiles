import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";

export default function AddFiles() {
  function handleUpload(e) {
    console.log(e.target.files[0]);
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
