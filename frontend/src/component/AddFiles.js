import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "../styles/Files.css";

export default function AddFiles({ onAddFile }) {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [access, setAccess] = React.useState("");

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setAccess("");
    setFile(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(
        `http://localhost:9999/upload`,
        {
          files: file,
          skemaAkses: access,
          currentDir: 0,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.message === "File uploaded") {
          alert("File succesfuly uploaded");
          setOpen(false);
          const fileObject = {
            id: res.data.data.fileId,
            name: file.name,
            date: res.data.data.uploadTime,
            akses: access,
            link: res.data.data.fileLink,
          };
          const existingFiles =
            JSON.parse(localStorage.getItem("dataFile")) || [];

          const updatedFiles = [...existingFiles, fileObject];
          localStorage.setItem("dataFile", JSON.stringify(updatedFiles));
        }
        console.log(res.data);
      })
      .catch((err) => {
        alert(err);
      });

    const newFile = {
      id: uuidv4(),
      name: file.name,
    };
    onAddFile(newFile);
  }

  return (
    <>
      <Button
        onClick={openModal}
        variant="outline-primary"
        size="sm"
        className="me-1"
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form>
          <Modal.Body>
            <Form.Group>
              <Form.Label>
                <strong>File Access</strong>
              </Form.Label>
              <Form.Select
                aria-label="Access"
                className="access"
                onChange={(e) => setAccess(e.target.value)}
              >
                <option value="Restricted">Restricted</option>
                <option value="FreeAccess">Free Access</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>
                <strong>File Name</strong>
              </Form.Label>
              <label className="form px-3">
                <input
                  type="file"
                  style={{ width: "100%" }}
                  onChange={({ target: { files } }) => {
                    setFile(files[0]);
                  }}
                />
              </label>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Upload File
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
