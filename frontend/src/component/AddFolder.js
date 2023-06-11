import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
//import uid
import { v4 as uuidv4 } from "uuid";

export default function AddFolder({ onAddFolder }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setName("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newFolder = {
      id: uuidv4(),
      name: name,
    };

    onAddFolder(newFolder);
    setOpen(false);
  }

  return (
    <>
      <Button onClick={openModal} variant="outline-primary" size="sm">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>
                <strong>Add Folder</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter folder name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
