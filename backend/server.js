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
  })
);
// app.use(cookieParser());

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
  deleteObject
} = require("firebase/storage");
const firebaseConfig = {
  apiKey: "AIzaSyCIgEfUm6wsJ0kD28tb3_Y0FZa9RC6MO5M",
  authDomain: "easyfiles-1cf32.firebaseapp.com",
  projectId: "easyfiles-1cf32",
  storageBucket: "easyfiles-1cf32.appspot.com",
  messagingSenderId: "863853774202",
  appId: "1:863853774202:web:65a52ec936c852c0e202c3",
};
firebase.initializeApp(firebaseConfig);

//PostgreSQL database init
const { Pool } = require("pg");
const db = new Pool({
  connectionString: process.env.SQL_CONNSTRING,
  sslmode: "require",
  ssl: true,
});
checkForError = (err) => {
  if (err) {
    console.log(err);
    return;
  }
  //console.log("Database succesfuly reached.");
}
//db.connect(checkForError);

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

	//Error handling
	if(!username){
		throw "ERROR: Username fields cannot be empty";
	}
	if(!password){
		throw "ERROR: Password fields cannot be empty";
	}

    queryResult = await db.query(
      `SELECT * FROM usertable WHERE userName = '${username}';`
    );
	const notFound = queryResult.rows.length == 0;
    if (notFound) {
      throw "Invalid username or password";
    }

	//Compare hash
    user = queryResult.rows[0];
    userHash = user.hashedpass;
    const match = await bcrypt.compare(password, userHash);
    if (!match) {
      throw "Invalid username or password";
    }

    userIdentifier = {
      username: user.username,
      nama: user.namapengguna,
    };

	//Sign JWT token for session-provision
    userToken = jwt.sign(userIdentifier, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // res.cookie("token", userToken);

    res.json({
      message: "Login succesful",
      data: userIdentifier,
      token: userToken,
      personalFolder: user.personalfolder
    });
  } catch (error) {
    res.json({
      message: "Error while logging in",
      error: error
    });
  }
};
app.post(`/login`, login);

const register = async (req, res) => {
  try {
    const { nama, username, password } = req.body;
    
    //Error handling
    if(!nama) throw "ERROR: Name fields cannot be empty";
	if(!username) throw "ERROR: Username fields cannot be empty";
	if(!password) throw "ERROR: Password fields cannot be empty";
	if(password.length < 8) throw "ERROR: Password must at least have 8 characters";

	//Check for username availability
    queryResult = await db.query(
      `SELECT * FROM userTable WHERE userName = '${username}';`
    );
    if (queryResult.rows.length != 0) {
      throw "Username taken";
    }

	//Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

	//Add user to database
    await db.query(
      `INSERT INTO userTable VALUES (
		'${username}', 
		'${hashedPass}', 
		'${nama}');`);

    //Add user personal folder to database
    const folderId = await nanoid();
    const namaFolder = nama + " Personal Folder";
    const skemaAkses = 'Restricted';
    const currentTime = DateTime.now().toFormat("MM-dd-yyyy hh:mm:ss");
    const rootFolderId = folderId; //Topmost folder
    const userPemilik = username;
    await db.query(
	  `INSERT INTO folder VALUES (
	  '${folderId}', 
	  '${namaFolder}', 
	  '${skemaAkses}', 
	  '${currentTime}', 
	  '${rootFolderId}',
	  '${userPemilik}');`);
	  
	//Add personal folder to user database
	await db.query(
		`UPDATE userTable SET personalfolder='${folderId}' WHERE username='${username}';`
	);

    res.json({
      message: "Registration succesful",
      data: {
		  username: username,
		  nama: nama,
		  personalfolder: folderId
	  }
    });
  } catch (error) {
    res.json({
      message: "Error while registering",
      error: error,
    });
  }
};
app.post(`/register`, register);

/*
app.get(`/`, authUser, (req, res) => {
  return res.json({
    message: "Success",
    user: req.user,
  });
});*/

function authUser(req, res, next) {
	try{
		const authHeader = req.headers["authorization"];

		if (authHeader == null) {
		throw "No session token provided";
		}

		//Get the token part
		const token = authHeader.split(" ")[1];
		
		// const token = req.cookies.token;

		jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
		if (err){
			throw "Token verification failed";
		}
		req.user = payload.username;
		req.nama = payload.nama;
		next();
		});
	} 
	catch(error){
		res.json({
			message: "Error while verifying user credentials",
			error: error
		});
	}
}

//====== FILE UPLOAD/DOWNLOAD API ======
const uploadFile = async (req, res) => {
  try {
	
    //Retrieve relevant data
    const fileToUpload = req.file;
	const { skemaAkses } = req.body;
	const { currentDir } = req.params;
	
	
	//Error handling
    if (fileToUpload == null) {
      throw "No file attached";
    }
	if(skemaAkses != 'Restricted' && skemaAkses != 'FreeAccess'){
		throw "Error while parsing Access Scheme field";
	}
	if(!currentDir) throw "No current directory specified";
		
		
	//Check for currentDir existence
	checkRootExists = await db.query(
	  `SELECT * FROM folder WHERE folderid = '${currentDir}';`
	);
	const notFound = checkRootExists.rows.length == 0;
	if (notFound) {
	  throw "Folder does not exists";
	}

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

	//Send query to DB
    await db.query(`INSERT INTO files VALUES (
		    '${fileId}',
			'${fileToUpload.originalname}',
			'${skemaAkses}',
			'${filesize}',
			'${currentTime}',
			'${currentDir}',
			'${req.user}',
			'${fileLink}'
			)`);

    res.json({
      message: "File uploaded",
      data: {
        fileId: fileId,
        fileName: fileToUpload.originalname,
        fileSize: filesize,
        fileLink: fileLink,
        skemaAkses: skemaAkses,
        uploadTime: currentTime,
        currentDir: currentDir,
        userPemilik: req.user,
      },
    });
  } catch (error) {
    res.json({
      message: "Error while uploading",
      error: error
    });
  }
};
app.post(`/:currentDir/upload`, authUser, upload.single("files"), uploadFile);

const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

	//Retrieve file from DB
    const queryResult = await db.query(
      `SELECT * FROM files WHERE fileId = '${fileId}'`
    );
    
    //Check for file existence
    const notFound = queryResult.rows.length == 0;
    if (notFound) {
      throw "Files not found";
    }

    filesToDownload = queryResult.rows[0];

	//Check access scheme
    const accessDenied =
      filesToDownload.skemaakses === `Restricted` &&
      filesToDownload.userpemilik !== req.user;
    if (accessDenied) {
      throw "Access denied";
    }

	//Redirect to download link
    res.redirect(filesToDownload.filelink);
    
  } catch (error) {
	res.json({
		message: "Error whlle downloading",
		error: error,
	});
  }
};
app.get(`/:fileId/download`, authUser, downloadFile);

//====== FILE VIEW AND ORGANIZATION ======
const createFolder = async (req, res) =>{
	try{
		const { namaFolder, skemaAkses, } = req.body;
		const { rootFolderId } = req.params;
		
		
		//Error handling
		if(!namaFolder) throw "Folder name cannot be empty";
		if(skemaAkses != 'Restricted' && skemaAkses != 'FreeAccess'){
			throw "Error while parsing Access Scheme field";
		}
		if(!rootFolderId) throw "No root folder specified";
		
		//Check for rootFolderId existence
		checkRootExists = await db.query(
		  `SELECT * FROM folder WHERE folderid = '${rootFolderId}';`
		);
		const notFound = checkRootExists.rows.length == 0;
		if (notFound) {
		  throw "Folder does not exists";
		}
		
		//Add folder to database
		const folderId = await nanoid();
		const currentTime = DateTime.now().toFormat("yyyy-MM-dd hh:mm:ss");
		const userPemilik = req.user;
		
		await db.query(
		  `INSERT INTO folder VALUES (
		  '${folderId}', 
		  '${namaFolder}', 
		  '${skemaAkses}', 
		  '${currentTime}', 
		  '${rootFolderId}',
		  '${userPemilik}');`);
		
		res.send("New folder succesfuly created");
	}
	catch(error){
		res.json({
		  message: "Error while creating new folder",
		  error: error
		});
	}
}
app.post(`/:rootFolderId/createNewFolder`, authUser, createFolder);

const folderViewQuery = (param) => {
	sortBy = null;
	sortMode = null;
	filterByName = null ;
	filterByOwner = null;
	filterByDateGTE = null;
	filterByDateLTE = null;
	
	var {
		rootFolderId,
		user,
		sortBy, //Sort by what (size, date, alphabetical)
		sortMode, //Sort in what mode (ascending, descending)
		filterByName, //Name filter (eg: only show file named X* (X, Xe, Xio))
		filterByOwner, //Owner filter (eg: only show file owned by X)
		filterByDateGTE, //Lower boundary for date filter (eg: only show file made after X)
		filterByDateLTE 
	} = param;
	
	//Generate base DB query for folder view
	const query_checkRootFolder = 
		` rootfolderid='${rootFolderId}' `;
	const query_checkForAccessScheme = 
		` (userpemilik='${user}' OR skemaakses='FreeAccess') `;
	const folder_baseQuery = 
		`SELECT * FROM folder WHERE (` + 
			query_checkRootFolder + `AND` +
			query_checkForAccessScheme + 
		`)`;
	
	//Generate lv1 filter (name) DB query for folder view
	query_filterByName = ''
	if(filterByName){
		query_filterByName = 
			` WHERE namafolder ILIKE '%${filterByName}%' `;
	}
	const folder_lv1Filter = 
		`SELECT * FROM base ` 
		+ query_filterByName 
	
	//Generate lv2 filter (owner) DB query for folder view
	query_filterByOwner = '';
	if(filterByOwner){
		query_filterByOwner = 
			` WHERE userpemilik='${filterByOwner}' `;
	}
	const folder_lv2Filter = 
		`SELECT * FROM lv1 ` 
		+ query_filterByOwner; 
	
	//Generate lv3 filter (date) DB query for folder view
	if(filterByDateGTE || filterByDateLTE){
		folder_lv3OneExists = 'WHERE';//Value: WHERE if one of GTE-LTE are non-null
	} else folder_lv3OneExists = '';//Default value: no 'AND'
	
	query_filterByDateGTE = ''
	if(filterByDateGTE){
		query_filterByDateGTE = 
			` tanggalpembuatan>='${filterByDateGTE}' `;
	}
	
	query_filterByDateLTE = ''
	if(filterByDateLTE){
		 query_filterByDateLTE = 
			` tanggalpembuatan<='${filterByDateLTE}' `;
	}
	
	if(filterByDateGTE && filterByDateLTE){	
		//Check if lower bound is higher than upper bound
		if(filterByDateGTE > filterByDateLTE){
			throw "Error while parsing filterByDate query";
		}
		
		folder_lv3BothExist = 'AND' //Value AND if both GTE-LTE are non-null
	} else folder_lv3BothExist = ''; //Default value: no 'AND'
	
	const folder_lv3Filter = 
		`SELECT * FROM lv2 ` 
		+ folder_lv3OneExists //Value: 'WHERE' or ''
		+ query_filterByDateGTE 
		+ folder_lv3BothExist //Value: 'AND' or ''
		+ query_filterByDateLTE;
	 
	//Generate clause for final query
	switch(sortBy){
		case 'tanggal':
			sortBy = 'tanggalPembuatan';
			break;
		default:
			sortBy = 'namaFolder';
	}
	switch(sortMode){
		case 'desc': break;
		default: sortMode = '';
	}
	const query_sortBy = ` ORDER BY ${sortBy} ${sortMode} `;
	
	//Generate final query
	const folder_finalQuery = 
	`WITH base AS (` +
		folder_baseQuery + 
	`), \n` +
	`lv1 AS (` +
		folder_lv1Filter +
	`), \n` +
	`lv2 AS (` +
		folder_lv2Filter +
	`), \n` +
	`lv3 AS (` +
		folder_lv3Filter +
	`) ` +
	`SELECT * FROM lv3` + query_sortBy;
	
	return folder_finalQuery;
}
const filesViewQuery = (param) => {
	sortBy = null;
	sortMode = null;
	filterByName = null ;
	filterByOwner = null;
	filterBySizeGTE = null;
	filterBySizeLTE = null;
	filterByDateGTE = null;
	filterByDateLTE = null;
	
	var {
		rootFolderId,
		user,
		sortBy, //Sort by what (size, date, alphabetical)
		sortMode, //Sort in what mode (ascending, descending)
		filterByName, //Name filter (eg: only show file named X* (X, Xe, Xio))
		filterByOwner, //Owner filter (eg: only show file owned by X)
		filterByDateGTE, //Lower boundary for date filter (eg: only show file made after X)
		filterByDateLTE, //Upper boundary for size filter (eg: only show file with size below X)
		filterBySizeGTE, //Lower boundary for size filter (eg: only show file with size above X)
		filterBySizeLTE, //Lower boundary for size filter (eg: only show file with size above X)
	} = param;
	
	//Generate base DB query for file view
	const query_checkRootFolder = 
		` directoryid='${rootFolderId}' `;
	const query_checkForAccessScheme = 
		` (userpemilik='${user}' OR skemaakses='FreeAccess') `;
	const files_baseQuery = 
		`SELECT * FROM files WHERE (` + 
			query_checkRootFolder + `AND` +
			query_checkForAccessScheme + 
		`)`;
	
	//Generate lv1 filter (name) DB query for file view
	query_filterByName = ''
	if(filterByName){
		query_filterByName = 
			` WHERE namafile ILIKE '%${filterByName}%' `;
	}
	const files_lv1Filter = 
		`SELECT * FROM base ` 
		+ query_filterByName 
	
	//Generate lv2 filter (owner) DB query for file view
	query_filterByOwner = '';
	if(filterByOwner){
		query_filterByOwner = 
			` WHERE userpemilik='${filterByOwner}' `;
	}
	const files_lv2Filter = 
		`SELECT * FROM lv1 ` 
		+ query_filterByOwner; 
	
	//Generate lv3 filter (date) DB query for file view
	if(filterByDateGTE || filterByDateLTE){
		files_lv3OneExists = 'WHERE';//Value: 'WHERE' if one of GTE-LTE are non-null
	} else files_lv3OneExists = '';//Default value: no 'AND'
	
	query_filterByDateGTE = ''
	if(filterByDateGTE){
		query_filterByDateGTE = 
			` tanggalupload>='${filterByDateGTE}' `;
	}

	query_filterByDateLTE = ''
	if(filterByDateLTE){
		 query_filterByDateLTE = 
			` tanggalupload<='${filterByDateLTE}' `;
	}
	
	if(filterByDateGTE && filterByDateLTE){	
		//Check if lower bound is higher than upper bound
		if(filterByDateGTE > filterByDateLTE){
			throw "Error while parsing filterByDate query";
		}
		
		files_lv3BothExist = 'AND' //Value: 'AND' if both GTE-LTE are non-null
	} else files_lv3BothExist = ''; //Default value: no 'AND'
	
	const files_lv3Filter = 
		`SELECT * FROM lv2 ` 
		+ files_lv3OneExists //Value: 'WHERE' or ''
		+ query_filterByDateGTE 
		+ files_lv3BothExist //Value: 'AND' or ''
		+ query_filterByDateLTE;
	 
	//Generate lv4 filter (size) DB query for file view
	if(filterBySizeGTE || filterBySizeLTE){
		files_lv4OneExists = 'WHERE';//Value: 'WHERE' if one of GTE-LTE are non-null
	} else files_lv4OneExists = '';//Default value: no 'AND'
	
	query_filterBySizeGTE = ''
	if(filterBySizeGTE){
		query_filterBySizeGTE = 
			` ukuran>='${filterBySizeGTE}' `;
	}

	query_filterBySizeLTE = ''
	if(filterBySizeLTE){
		 query_filterBySizeLTE = 
			` ukuran<='${filterBySizeLTE}' `;
	}
	
	if(filterBySizeGTE && filterBySizeLTE){	
		//Check if lower bound is higher than upper bound
		if(filterBySizeGTE > filterBySizeLTE){
			throw "Error while parsing filterBySize query";
		}
		
		files_lv4BothExist = 'AND' //Value: 'AND' if both GTE-LTE are non-null
	} else files_lv4BothExist = ''; //Default value: no 'AND'
	
	const files_lv4Filter = 
		`SELECT * FROM lv3 ` 
		+ files_lv4OneExists //Value: 'WHERE' or ''
		+ query_filterBySizeGTE 
		+ files_lv4BothExist //Value: 'AND' or ''
		+ query_filterBySizeLTE;
	 
	//Generate clause for final query
	switch(sortBy){
		case 'tanggal':
			sortBy = 'tanggalPembuatan';
			break;
		case 'ukuran': break;
		default:
			sortBy = 'namafile';
	}
	switch(sortMode){
		case 'desc': break;
		default: sortMode = '';
	}
	const query_sortBy = ` ORDER BY ${sortBy} ${sortMode} `;
	
	//Generate final query
	const files_finalQuery = 
	`WITH base AS (` +
		files_baseQuery + 
	`), \n` +
	`lv1 AS (` +
		files_lv1Filter +
	`), \n` +
	`lv2 AS (` +
		files_lv2Filter +
	`), \n` +
	`lv3 AS (` +
		files_lv3Filter +
	`), \n` +
	`lv4 AS (` +
		files_lv4Filter +
	`) ` +
	`SELECT * FROM lv4` + query_sortBy;
	return files_finalQuery
}
const viewFolderContent = async (req, res) => {
	try{
		const { rootFolderId } = req.params;
		
		var {
			sortBy, //Sort by what (size, date, alphabetical)
			sortMode, //Sort in what mode (ascending, descending)
			filterByName, //Name filter (eg: only show file named X* (X, Xe, Xio))
			filterByOwner, //Owner filter (eg: only show file owned by X)
			filterBySizeGTE, //Lower boundary for size filter (eg: only show file with size above X)
			filterBySizeLTE, //Upper boundary for size filter (eg: only show file with size below X)
			filterByDateGTE, //Lower boundary for date filter (eg: only show file made after X)
			filterByDateLTE //Upper boundary for size filter (eg: only show file with made before X)
		} = req.query;
		
		
		//Check for rootFolderId existence
		checkRootExists = await db.query(
		  `SELECT * FROM folder WHERE folderid = '${rootFolderId}';`
		);
		const notFound = checkRootExists.rows.length == 0;
		if (notFound) {
		  throw "Folder does not exists";
		}
		
		const folderParam = {
			rootFolderId: rootFolderId,
			user: req.user,
			sortBy: sortBy, 
			sortMode: sortMode, 
			filterByName: filterByName,
			filterByOwner: filterByOwner, 
			filterByDateGTE: filterByDateGTE,
			filterByDateLTE: filterByDateLTE 
		};
		const folderViewResult = await db.query(folderViewQuery(folderParam));
		const filesParam =  Object.assign(folderParam, 
			{
				filterBySizeGTE:filterBySizeGTE, 
				filterBySizeLTE:filterBySizeLTE
			}
		);
		
		const filesViewResult = await db.query(filesViewQuery(filesParam));
		
		res.json({
			folder: folderViewResult.rows,
			files: filesViewResult.rows
		});
		
	}
	catch(err){
		res.json({
			message: "Error occured while viewing",
			error: err
		});
	}
}
app.get(`/:rootFolderId/view`, authUser, viewFolderContent);

// ====== FILE DELETE API ======
const deleteFile = async (req, res) => {
	try {
		const { fileId } = req.params;
	
		const queryResult = await db.query(`SELECT * FROM files WHERE fileId = '${fileId}'`);
		
		const notFound = (queryResult.rows.length === 0);
		if (notFound) {
			throw "File not found";
		}	
	
		const fileToDelete = queryResult.rows[0];
		
		// Check if the user has permission to delete the file
		const accessDenied = (fileToDelete.userpemilik !== req.user);
		
		if (accessDenied) {
			throw "Access denied"
		}

		const fileRef = ref(getStorage(), `${fileToDelete.directoryid}/${fileToDelete.namafile}`);
		await deleteObject(fileRef);
		
		// Delete the file entry from the database
		await db.query(`DELETE FROM files WHERE fileId = '${fileId}'`);
	
		res.send("File successfully deleted");
	} catch (error) {
		res.json({
			message: "Error searching in table",
			error: error,
		});
	}
};
app.delete(`/:fileId/delete`, authUser, deleteFile);

// ====== FILE SEARCH API =====
const searchInTable = async (req, res) => {
	try {
		const { searchTerm } = req.body;
		const {user} = req;
	
		const searchQuery = `
			(SELECT * 
			FROM files 
			WHERE namafile ILIKE '%${searchTerm}%'
			AND userpemilik = '${user}')
			UNION 
			(SELECT * 
			FROM files 
			WHERE namafile ILIKE '%${searchTerm}%'
			AND skemaakses = 'FreeAccess')
		`;
	
		const result = await db.query(searchQuery);
	
		res.json({
			message: "Search results",
			data: result.rows,
		});
	} catch (error) {
		res.json({
			message: "Error searching in table",
			error: error,
		});
	} 
};
app.get("/search", authUser, searchInTable);


// ====== GET-ALL FILE/FOLDER API =====
const getUserFiles = async (req, res) => {
  try {
    const queryResult = await db.query(
      `SELECT * FROM files`
    );

    const notFound = queryResult.rows.length == 0;
    if (notFound) throw "Files not found";

    res.json({
      message: "User files retrieved",
      data: queryResult.rows,
    });
  } catch (error) {
		res.json({
			message: "Error fetching files",
			error: error,
		});
  }
};
app.get(`/getFile`, authUser, getUserFiles);

const getUserFolder = async (req, res) => {
  await db.connect(checkForError);
  try {
    const queryResult = await db.query(
      `SELECT * FROM folder`
    );

    const notFound = queryResult.rows.length == 0;
    if (notFound) throw "Folder not found";

    res.json({
      message: "User folder retrieved",
      data: queryResult.rows,
    });
  } catch (error) {
	res.json({
		message: "Error fetching folder",
		error: error,
	});
   }
  await db.end()
};
app.get(`/getFolder`, authUser, getUserFolder);


app.listen(9999, () => {
  console.log("Listening to Port 9999.");
});
