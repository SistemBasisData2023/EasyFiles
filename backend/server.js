//ExpressJS init
const express = require("express");
const bp = require("body-parser");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

//Dotenv init
const dotenv = require("dotenv");
dotenv.config();

//Firebase init
const firebase = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  updateMetadata,
} = require("firebase/storage");
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
};
firebase.initializeApp(firebaseConfig);

//PostgreSQL database init
const { Client } = require("pg");
const db = new Client({
  connectionString:
    "postgres://agungfir20:s1FYO0nBvxiE@ep-yellow-shape-568138.ap-southeast-1.aws.neon.tech/test_pa",
  sslmode: "require",
  ssl: true,
});
db.connect((err) => {
  if (err) {
    console.log(err);
    db.connect();
    return;
  }
  console.log("Database succesfuly reached.");
});

//Multer init
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

//Misc. util. init
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const { DateTime } = require("luxon");

//====== AUTH API ======
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    queryResult = await db.query(
      `SELECT * FROM usertable WHERE userName = '${username}';`
    );

    if (queryResult.rows.length == 0) {
      res.send("Invalid Username or Password");
      return;
    }

    user = queryResult.rows[0];
    userHash = user.hashedpass;
    const match = await bcrypt.compare(password, userHash);

    if (!match) {
      res.send("Invalid Username or Password");
      return;
    }

    userIdentifier = {
      username: user.username,
      nama: user.namapengguna,
    };

    userToken = jwt.sign(userIdentifier, "secretaccesstokenhere", {
      expiresIn: "1h",
    });

    res.cookie("token", userToken);

    res.json({
      message: "Login succesful",
      data: userIdentifier,
      token: userToken,
    });
  } catch (error) {
    res.json({
      message: "Unknown error while logging in",
    });
  }
};
app.post(`/login`, login);

const register = async (req, res) => {
  try {
    const { nama, username, password } = req.body;

    queryResult = await db.query(
      `SELECT * FROM userTable WHERE userName = '${username}';`
    );
    if (queryResult.rows.length != 0) {
      res.send("Username taken");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    queryResult = await db.query(
      `INSERT INTO userTable VALUES ('${username}', '${hashedPass}', '${nama}');`
    );

    res.json({
      message: "Registration succesful",
    });
  } catch (error) {
    res.json({
      message: "Unknown error while registering",
      error: error,
    });
  }
};
app.post(`/register`, register);

app.post(`/logout`, async (req, res) => {
  try {
    //Implement this later
    res.clearCookie("token");
    res.json({
      message: "Logout succesful",
    });
  } catch (error) {
    res.json({
      message: "Unknown Error",
      error: error,
    });
  }
});

app.get(`/`, authUser, (req, res) => {
  return res.json({
    message: "Success",
    user: req.user,
  });
});

function authUser(req, res, nex) {
  // const authHeader = req.headers["authorization"];
  // if (authHeader == null) {
  //   res.send("Error: No session token provided");
  //   return;
  // }
  // const token = authHeader.split(" ")[1];

  const token = req.cookies.token;

  if (token == null) {
    res.send("Error: No session token provided");
    return;
  } else {
    jwt.verify(token, "secretaccesstokenhere", (err, payload) => {
      if (err) res.send("Error: Token verification failed");
      req.user = payload.username;
      req.nama = payload.nama;
      nex();
    });
  }
}

//====== FILE UPLOAD/DOWNLOAD API ======
const uploadFile = async (req, res) => {
  try {
    const fileToUpload = req.file;

    if (fileToUpload == null) {
      res.send("No file attached");
    }

    const { skemaAkses, currentDir } = req.body;

    //Upload file to firebase
    const storageRef = ref(
      getStorage(),
      `${currentDir}/${fileToUpload.originalname}`
    );
    await uploadBytes(storageRef, fileToUpload.buffer);
    await updateMetadata(storageRef, { contentType: fileToUpload.mimetype });
    const fileLink = await getDownloadURL(storageRef);

    //Get fileId
    const fileId = await nanoid();

    //Get filesize
    const filesize = fileToUpload.size;

    //Get current time
    const currentTime = DateTime.now().toFormat("MM-dd-yyyy hh:mm:ss");

    db.query(`INSERT INTO files VALUES (
		    '${fileId}',
			'${fileToUpload.originalname}',
			'${skemaAkses}',
			'${filesize}',
			'${currentTime}',
			'${currentDir}',
			'${req.user}',
			'${fileLink}'
			)`);

    res.send("File succesfuly uploaded");
  } catch (err) {
    res.send("Unknown error while uploading file");
  }
};
app.post(`/upload`, authUser, upload.single("files"), uploadFile);

const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const queryResult = await db.query(
      `SELECT * FROM files WHERE fileId = '${fileId}'`
    );
    const notFound = queryResult.rows.length == 0;
    if (notFound) {
      res.send("Files not found");
      return;
    }

    filesToDownload = queryResult.rows[0];

    const accessDenied =
      filesToDownload.skemaakses == `Restricted` &&
      filesToDownload.userpemilik != req.username;
    if (accessDenied) {
      res.send("Access denied");
      return;
    }

    res.redirect(filesToDownload.filelink);
  } catch (err) {
    res.send("Unknown error while downloading file");
  }
};
app.get(`/:fileId/download`, authUser, downloadFile);

app.listen(9999, () => {
  console.log("Listening to Port 9999.");
});
