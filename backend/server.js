const express = require("express");
const { Client } = require("pg");
const bp = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:3000",
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const db = new Client({
  host: "ep-yellow-shape-568138.ap-southeast-1.aws.neon.tech",
  port: 5432,
  user: "agungfir20",
  password: "s1FYO0nBvxiE",
  database: "test_pa",
  sslmode: "require",
  ssl: true,
});

db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Database succesfuly reached.");
});

//Auth API
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    queryResult = await db.query(
      `SELECT * FROM userTable WHERE username = '${username}';`
    );

    if (queryResult.rows.length == 0) {
      res.send("Invalid username or password");
      return;
    }

    user = queryResult.rows[0];
    userHash = user.hashedPass;
    const match = await bcrypt.compare(password, userHash);

    if (!match) {
      res.send("Invalid username or password");
      return;
    }

    userIdentifier = {
      username: user.username,
      nama: user.namapengguna,
    };

    userToken = jwt.sign(userIdentifier, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login succesful",
      data: userIdentifier,
      token: userToken,
    });
  } catch (error) {
    res.json({
      message: "Unknown Error",
      error: error,
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
      data: req.body,
    });
  } catch (error) {
    res.json({
      message: "Unknown Error",
      error: error,
    });
  }
};
app.post(`/register`, register);

app.post(`/logout`, async (req, res) => {
  try {
    //Implement this later
  } catch (error) {
    res.json({
      message: "Unknown Error",
      error: error,
    });
  }
});

app.listen(9999, () => {
  console.log("Listening to Port 9999.");
});
