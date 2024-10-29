const { create } = require("domain");
const fs = require("fs");
const { resolve } = require("path");
const path = require("path");
const connectDB = require("../dbConnect/dbConnect");

/*
====================== Create Folder Function ======================
1- this function creates a new folder in a specific parent folder
2- saves the folder path in the database
3- returns the folder path to the user so he can configure his scanning machien
   by setting the folder path as the output path to the scanned files
*/
exports.createFolder = (folderName) => {
  const mainDirectory = path.join("files", folderName);
  return new Promise((resolve, reject) => {
    fs.access(mainDirectory, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(mainDirectory, { recursive: true }, (err) => {
          if (err) {
            return resolve(false);
          } else {
            console.log("folder created successfully!");
            return resolve(true);
          }
        });
      } else {
        return resolve(false);
      }
    });
  });
  /* 
  2- save the folder path in the data base
  3- return the absolute path of the created folder to the client
  */
};

/*
================Is File Exist Function=================
1- takes the file path and file url as parameters
2- makes sure that the file exist and returns an error if not
3- insert the file url to the database if file exist
*/
exports.isFileExist = (filePath, imageUrl) => {
  try {
    fs.access(filePath, fs.constants.F_OK, async (err) => {
      if (err) {
        console.log(err);
        return;
      } else {
        const connection = await connectDB.getConnection();
        await connection.execute(`INSERT INTO SCANNED_FILES (FILE_URL, USER_NAME) 
        VALUES ('${imageUrl}', 'HOSSAM')`);
        await connection.tpcCommit();
      }
    });
  } catch (err) {
    console.log(err);
  }
};
/* 
================= Watch Files Function=================
1- the function receives the folder path as a parameter
2- it watches the rename event to happen 
3- if the event triggered it takes the file name and create a path for it
4- it creates a url for the file and pass both file name and url to the file exist function
*/
exports.watchFiles = (folderPath) => {
  // when applying dynamic folders get the folders list you want to watch and loop over it
  try {
    fs.watch(folderPath, (eventType, fileName) => {
      if (eventType === "rename") {
        const newFilePath = `${folderPath}/${fileName}`;
        const baseUrl = `${process.env.PROTOCOL}://${process.env.DOMAIN}:${process.env.PORT}/images/`;
        const imageUrl = baseUrl + fileName;
        this.isFileExist(newFilePath, imageUrl);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

/*
===================== Watch Folders Function =======================
1- the function gets the folders paths from the database
2- it loops over the folders paths contuinuesly to monitor it
3- if any file added to any folders it starts creating a path and url for it
*/
exports.watchFolders = (folderPaths) => {
  // when applying dynamic folders get the folders list you want to watch and loop over it
  try {
    for (let folderPath of folderPaths) {
      fs.watch(folderPath, (eventType, fileName) => {
        if (eventType === "rename") {
          const newFilePath = `${folderPath}/${fileName}`;
          const baseUrl = `${process.env.PROTOCOL}://${process.env.DOMAIN}:${process.env.PORT}`;
          const pathArray = newFilePath.split(".");
          console.log(pathArray);
          const imageUrl =
            baseUrl + pathArray.slice(1, pathArray.length).join(".");
          this.isFileExist(newFilePath, imageUrl);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.isFolderExist = (folderName) => {
  try {
    const folderPath = path.join("files", folderName);
    return new Promise((resolve) => {
      fs.access(folderPath, fs.constants.F_OK, (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

exports.deleteFile = (folderName, fileName) => {
  try {
    const filePath = path.join("files", folderName, fileName);
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          return resolve(false);
        } else {
          return resolve(true);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

exports.deleteFolder = (folderName) => {
  try {
    const folderPath = path.join("files", folderName);
    return new Promise((resolve, reject) => {
      fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};
