import React, { useEffect } from "react";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Menu } from "antd";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

export default function Files({ file }) {
  const [token, setToken] = React.useState(null);
  const [username, setUsername] = React.useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUsername(localStorage.getItem("username"));
  }, []);

  const handleMenu = (value) => {
    if (value === "Download") {
      if (file.skemaakses === "Restricted" && file.userpemilik !== username) {
        alert("You don't have access to this file");
      } else {
        // fetch(file.filelink)
        //   .then((response) => response.blob())
        //   .then((blob) => {
        //     const blobURL = window.URL.createObjectURL(new Blob([blob]));
        //   });
        const fileName = file.namafile;
        const aTag = document.createElement("a");
        aTag.href = file.link;
        aTag.setAttribute("download", fileName);
        document.body.appendChild(aTag);
        aTag.click();
        aTag.remove();
        // window.location.href = file.link;
      }
    } else if (value === "Delete") {
      if (file.userpemilik !== username) {
        alert("You can't delete this file");
      } else {
        axios
          .delete(`http://localhost:9999/${file.fileid}/delete`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.data === "File successfully deleted") {
              alert("File successfully deleted");
              window.location.reload(true);
            }
          })
          .catch((err) => {
            alert(err);
          });
      }
    }
  };

  const menu = (
    <Menu
      onClick={({ key }) => handleMenu(key)}
      items={[
        {
          key: "Download",
          label: "Download",
          icon: <DownloadOutlined />,
        },

        {
          key: "Delete",
          label: "Delete",
          danger: true,
          icon: <DeleteOutlined />,
        },
      ]}
    />
  );

  return (
    <Dropdown overlay={menu} trigger={["contextMenu"]}>
      <a
        href={file.link}
        target="_blank"
        className={`btn btn-outline-primary text-truncate w-100 ${
          file.skemaakses === "Restricted" && file.userpemilik !== username
            ? "disabled"
            : ""
        }`}
      >
        <FontAwesomeIcon icon={faFile} className="me-2" />
        {file.namafile}
      </a>
    </Dropdown>
  );
}
