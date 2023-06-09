//ExpressJS init
const express = require("express");
const bp = require('body-parser');
const app = express();
app.use(bp.json());
app.use(bp.urlencoded({extended:true}))

//Dotenv init
const dotenv = require('dotenv');
dotenv.config()

//Firebase init
const firebase = require("firebase/app");
const { getStorage, ref, uploadBytes, getDownloadURL, updateMetadata } = require("firebase/storage");
const firebaseConfig = {
  apiKey			: process.env.FIREBASE_APIKEY,
  authDomain		: process.env.FIREBASE_AUTHDOMAIN,
  projectId			: process.env.FIREBASE_PROJECTID,
  storageBucket		: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId	: process.env.FIREBASE_MESSAGINGSENDERID,
  appId				: process.env.FIREBASE_APPID
};
firebase.initializeApp(firebaseConfig);

//PostgreSQL database init
const { Client } = require("pg");
const db = new Client({
	connectionString: process.env.SQL_CONNSTRING,
    sslmode: "require",
    ssl: true
});
db.connect((err)=>{
    if(err){
        console.log(err)
        db.connect();
        return
    }
    console.log('Database succesfuly reached.')
})

//Multer init
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

//Misc. util. init
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const { DateTime } = require("luxon");


//====== AUTH API ======
const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		
		queryResult = await db.query(`SELECT * FROM userTable WHERE userName = '${username}';`);
		
		if(queryResult.rows.length == 0){
			res.send("Invalid username or password");
			return;
		}
		
		user = queryResult.rows[0];
		userHash = user.hashedpass;
		const match = await bcrypt.compare(password, userHash); 
		
		
		if(!match){
			res.send("Invalid username or password");
			return;
		}	
		
		userIdentifier = { 
			username: user.username, 
			nama: user.namapengguna 
		};
		
		userToken = jwt.sign(userIdentifier, process.env.JWT_SECRET, { expiresIn: "1h" } );
		
		res.json({
			message: "Login succesful",
			data: userIdentifier,
			token: userToken
		})
		
	} 
	catch(error) {
		res.json({
			message: "Unknown error while logging in"
		});
	}
}; 
app.post(`/login`, login);

const register = async (req, res) => {
	try {
		const { nama, username, password } = req.body;
		
		
		queryResult = await db.query(`SELECT * FROM userTable WHERE userName = '${username}';`);		
		if(queryResult.rows.length != 0){
			res.send("Username taken");
			return;
		}
		
		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(password, salt);
		
		queryResult = await db.query(`INSERT INTO userTable VALUES ('${username}', '${hashedPass}', '${nama}');`);

		res.json({
			message: "Registration succesful"
		})
	} 
	catch(error) {
		res.json({
			message: "Unknown error while registering",
			error: error
		});
	}
}
app.post(`/register`, register);

app.post(`/logout`, async (req, res) => {
	try {
		//Implement this later
	} 
	catch(error) {
		res.json({
			message: "Unknown Error",
			error: error
		});
	}
});

function authUser(req, res, nex) {
	const authHeader = req.headers['authorization'];
	if(authHeader == null){
		res.send("Error: No session token provided");	
		return;	
	}
	const token = authHeader.split(' ')[1];
	
	jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
		if(err) res.send("Error: Token verification failed");
		req.user = payload.username;
		req.nama = payload.nama;
		nex();
	});
}

//====== FILE UPLOAD/DOWNLOAD API ======
const uploadFile = async (req, res) => {
	try{
		
		const fileToUpload = req.file
		
		if(fileToUpload == null){
			res.send("No file attached")
		}
		
		const { skemaAkses, currentDir } = req.body
		
		//Upload file to firebase
		const storageRef = ref(getStorage(), `${currentDir}/${fileToUpload.originalname}`);
		await uploadBytes(storageRef, fileToUpload.buffer);
		await updateMetadata(storageRef, {contentType: fileToUpload.mimetype});
		const fileLink = await getDownloadURL(storageRef);
		
		//Get fileId
		const fileId = await nanoid();
		
		//Get filesize
		const filesize = fileToUpload.size;
		
		//Get current time
		const currentTime = DateTime.now().toFormat('MM-dd-yyyy hh:mm:ss');
		
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
	}
	catch(err){
		res.send("Unknown error while uploading file");
	}
};
app.post(`/upload`, authUser, upload.single("files"), uploadFile);

const downloadFile = async (req, res) => {
	try{
		const { fileId } = req.params;
		
		const queryResult = await db.query(`SELECT * FROM files WHERE fileId = '${fileId}'`);
		const notFound = (queryResult.rows.length == 0);
		if(notFound){
			res.send("Files not found");
			return;
		}
		
		filesToDownload = queryResult.rows[0];
		
		const accessDenied = (filesToDownload.skemaakses == `Restricted`) &&
								(filesToDownload.userpemilik != req.username)
		if(accessDenied){
			res.send("Access denied");
			return;
		}
		
		res.redirect(filesToDownload.filelink);
	}
	catch(err){
		res.send("Unknown error while downloading file");
	}
		
};
app.get(`/:fileId/download`, authUser, downloadFile);


app.listen(9999,()=>{
    console.log('Listening to Port 9999.')
})
