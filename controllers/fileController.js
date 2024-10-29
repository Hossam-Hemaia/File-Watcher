const utilities = require("../utils/utilities");

exports.postCreateCompanyFolder = async (req, res, next) => {
  try {
    const folderName = req.body.folderName;
    const folderCreated = await utilities.createFolder(folderName);
    if (folderCreated) {
      res
        .status(201)
        .json({ success: true, message: "folder created successfully!" });
    } else {
      res
        .status(201)
        .json({ success: true, message: "folder name already exists!" });
    }
  } catch (err) {
    next(err);
  }
};

exports.postUploadCompanyFile = async (req, res, next) => {
  try {
    const folderName = req.body.folderName;
    const file = req.file;
    if (!file) {
      const error = new Error("file must be uploaded!");
      error.statusCode = 422;
      throw error;
    }
    const folderExist = await utilities.isFolderExist(folderName);
    if (!folderExist) {
      const error = new Error(
        "folder name does not exist!, create folder first"
      );
      error.statusCode = 422;
      throw error;
    }
    const fileUrl = `${process.env.PROTOCOL}://${req.get("host")}/${file.path}`;
    const fileName = file.filename;
    res.status(201).json({ success: true, fileUrl, fileName });
  } catch (err) {
    next(err);
  }
};

exports.deleteCompanyFile = async (req, res, next) => {
  try {
    const folderName = req.query.folderName;
    const fileName = req.query.fileName;
    const isDeleted = await utilities.deleteFile(folderName, fileName);
    if (isDeleted) {
      return res
        .status(200)
        .json({ success: true, message: "file removed successfully" });
    } else {
      const error = new Error("cannot delete file of file does not exist!");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteCompanyFolder = async (req, res, next) => {
  try {
    const folderName = req.query.folderName;
    const folderDeleted = await utilities.deleteFolder(folderName);
    if (!folderDeleted) {
      const error = new Error("cannot delete folder of folder does not exist!");
      error.statusCode = 404;
      throw error;
    } else {
      return res
        .status(200)
        .json({ success: true, message: "folder deleted successfully" });
    }
  } catch (err) {
    next(err);
  }
};
