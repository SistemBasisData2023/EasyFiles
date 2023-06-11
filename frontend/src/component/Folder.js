import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

export default function Folder({ folder }) {
  const [user, setUser] = React.useState({});

  useEffect(() => {
    setUser(localStorage.getItem("username"));
  }, []);

  return (
    <Button
      to={{
        pathname: `/folder/${folder.folderid}`,
        state: {
          folder: folder,
        },
      }}
      as={Link}
      variant="outline-primary"
      className="text-truncate w-100"
      disabled={
        folder.userpemilik !== user && folder.skemaakses === "Restricted"
          ? true
          : false
      }
    >
      <FontAwesomeIcon icon={faFolder} className="me-2" />
      {folder.namafolder}
    </Button>
  );
}
