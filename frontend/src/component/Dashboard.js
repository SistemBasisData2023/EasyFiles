import React from "react";
import Navbar from "./NavBar";
import { Container } from "react-bootstrap";
import AddFolder from "./AddFolder";
import AddFiles from "./AddFiles";
import Filter from "./Filter";
import Folder from "./Folder";
import File from "./Files";

export default function Dashboard() {
  const [folders, setFolders] = React.useState([]);
  const [files, setFiles] = React.useState([]);

  function addFo(newFolder) {
    setFolders((prevFolders) => {
      return [...prevFolders, newFolder];
    });
  }

  function addFi(newFile) {
    setFiles((prevFiles) => {
      return [...prevFiles, newFile];
    });
  }

  function handleFilter(filter) {
    switch (filter) {
      case "Sort Ascending":
        setFiles((prevFiles) => {
          return [...prevFiles].sort((a, b) => a.name.localeCompare(b.name));
        });
        setFolders((prevFolders) => {
          return [...prevFolders].sort((a, b) => a.name.localeCompare(b.name));
        });
        break;
      case "Sort Descending":
        setFiles((prevFiles) => {
          return [...prevFiles].sort((a, b) => b.name.localeCompare(a.name));
        });
        setFolders((prevFolders) => {
          return [...prevFolders].sort((a, b) => b.name.localeCompare(a.name));
        });
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div className="bg-light min-vh-100">
        <Navbar />
        <Container className="mt-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3>Dashboard</h3>
            </div>
            <div className="d-flex">
              <Filter onFilter={handleFilter} />
              <AddFiles onAddFile={addFi} />
              <AddFolder onAddFolder={addFo} />
            </div>
          </div>
          {folders.length > 0 && <p className="fs-6 mt-1">Folder/</p>}
          <div className="d-flex flex-wrap">
            {folders.map((folder) => (
              <div style={{ maxWidth: "200px" }} className="pe-2 mb-2">
                <Folder key={folder.id} folder={folder} />
              </div>
            ))}
          </div>
          {folders.length > 0 && files.length > 0 && <hr />}
          <div className="d-flex flex-wrap">
            {files.map((file) => (
              <div style={{ maxWidth: "200px" }} className="pe-2 mb-2">
                <File key={file.id} file={file} />
              </div>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
