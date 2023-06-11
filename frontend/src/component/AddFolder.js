import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
//import uid
import { v4 as uuidv4 } from "uuid";
import Folder from "./Folder";
import axios from "axios";

export default function AddFolder() {
  const [open, setOpen] = React.useState(false);
  const [folderName, setFolderName] = React.useState("");
  const [access, setAccess] = React.useState("Restricted");

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setFolderName("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post(
        `http://localhost:9999/${localStorage.getItem(
          "folder"
        )}/createNewFolder`,
        {
          namaFolder: folderName,
          skemaAkses: access,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data === "New folder succesfuly created") {
          alert("Folder succesfuly created");
          setOpen(false);
          window.location.reload(true);
        }
        console.log(res.data);
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <>
      <Button onClick={openModal} variant="outline-primary" size="sm">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form>
          <Modal.Body>
            <Form.Group>
              <Form.Label>
                <strong>Folder Access</strong>
              </Form.Label>
              <Form.Select
                aria-label="Access"
                className="access"
                value={access}
                onChange={(e) => setAccess(e.target.value)}
              >
                <option value="Restricted">Restricted</option>
                <option value="FreeAccess">Free Access</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <strong>Folder Name</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter folder name"
                required
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
