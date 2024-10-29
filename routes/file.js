const express = require("express");
const fileController = require("../controllers/fileController");

const router = express.Router();

router.post("/create/company/folder", fileController.postCreateCompanyFolder);

router.post("/upload/company/file", fileController.postUploadCompanyFile);

router.delete("/remove/company/file", fileController.deleteCompanyFile);

router.delete("/remove/company/folder", fileController.deleteCompanyFolder);

module.exports = router;
