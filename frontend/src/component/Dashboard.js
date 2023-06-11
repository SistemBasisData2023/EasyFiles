import React, { useEffect } from "react";
import Navbar from "./NavBar";
import { Container } from "react-bootstrap";
import AddFolder from "./AddFolder";
import AddFiles from "./AddFiles";
import Filter from "./Filter";
import Folder from "./Folder";
import File from "./Files";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [folders, setFolders] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [initialFile, setInitialFile] = React.useState([]);
  const [initialFolder, setInitialFolder] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [user, setUser] = React.useState("");
  const navigate = useNavigate();

  const getFile = () => {
    axios
      .get(`http://localhost:9999/getFile`)
      .then((res) => {
        if (res.data.message === "Files retrieved") {
          setFiles(res.data.data);
          setInitialFile(res.data.data);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getFolder = () => {
    axios
      .get(`http://localhost:9999/getFolder`)
      .then((res) => {
        if (res.data.message === "Folder retrieved") {
          setFolders(res.data.data);
          setInitialFolder(res.data.data);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    // const storedFile = JSON.parse(localStorage.getItem("dataFile")) || [];
    // setFiles(storedFile);
    getFile();
    getFolder();
    setUser(localStorage.getItem("username"));
  }, []);

  function handleFilter(filter) {
    setFiles(initialFile);
    setFolders(initialFolder);
    switch (filter) {
      case "Sort Ascending":
        setFiles((prevFiles) => {
          return [...prevFiles].sort((a, b) =>
            a.namafile.localeCompare(b.namafile)
          );
        });
        setFolders((prevFolders) => {
          return [...prevFolders].sort((a, b) =>
            a.namafolder.localeCompare(b.namafolder)
          );
        });
        break;
      case "Sort Descending":
        setFiles((prevFiles) => {
          return [...prevFiles].sort((a, b) =>
            b.namafile.localeCompare(a.namafile)
          );
        });
        setFolders((prevFolders) => {
          return [...prevFolders].sort((a, b) =>
            b.namafolder.localeCompare(a.namafolder)
          );
        });
        break;
      case "Sort Date Ascending":
        setFiles((prevFiles) => {
          return [...prevFiles].sort((a, b) =>
            a.tanggalupload.localeCompare(b.tanggalupload)
          );
        });
        setFolders((prevFolders) => {
          return [...prevFolders].sort((a, b) =>
            a.tanggalpembuatan.localeCompare(b.tanggalpembuatan)
          );
        });
        break;
      case "Sort Date Descending":
        setFiles((prevFiles) => {
          return [...prevFiles].sort((a, b) =>
            b.tanggalupload.localeCompare(a.tanggalupload)
          );
        });
        setFolders((prevFolders) => {
          return [...prevFolders].sort((a, b) =>
            b.tanggalpembuatan.localeCompare(a.tanggalpembuatan)
          );
        });
        break;
      case "FreeAccess":
        setFiles((prevFiles) => {
          const filteredFiles = prevFiles.filter(
            (file) => file.skemaakses === "FreeAccess"
          );
          return [...filteredFiles];
        });
        setFolders((prevFolders) => {
          const fileteredFolders = prevFolders.filter(
            (folder) => folder.skemaakses === "FreeAccess"
          );
          return [...fileteredFolders];
        });
        break;
      case "Own":
        setFiles((prevFiles) => {
          const filteredFiles = prevFiles.filter(
            (file) => file.userpemilik === user
          );
          return [...filteredFiles];
        });
        setFolders((prevFolders) => {
          const fileteredFolders = prevFolders.filter(
            (folder) => folder.userpemilik === user
          );
          return [...fileteredFolders];
        });
        break;

      default:
        setFiles(...initialFile);
        setFolders(...initialFolder);
        break;
    }
  }

  console.log(search);

  return (
    <>
      <div className="bg-light min-vh-100">
        <Navbar className="fixed-top" onSearch={setSearch} />
        <Container className="mt-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3>Dashboard</h3>
            </div>
            <div className="d-flex">
              <Filter onFilter={handleFilter} />
              <AddFiles />
              <AddFolder />
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
            {files
              .filter((file) => {
                return search.toLocaleLowerCase() === ""
                  ? file
                  : file.namafile
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase());
              })
              .map((file) => (
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
