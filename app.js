const path = require("path");
const express = require("express");
const compression = require("compression");
const dotenv = require("dotenv");
const multer = require("multer");
const slugify = require("slugify");
const connectDB = require("./dbConnect/dbConnect");

const fileRouter = require("./routes/file");
// const utilities = require("./utils/utilities");

const app = express();
dotenv.config();

// const folderPath = "./files";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.body.folderName;
    cb(null, `files/${folderName}`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + slugify(file.originalname));
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

async function dbConn() {
  await connectDB.init();
}

dbConn();

app.use("/files", express.static(path.join(__dirname, "files")));
app.use(multer({ storage: fileStorage }).single("file"));

app.use(process.env.api, fileRouter);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ success: false, message: message });
});

app.listen(process.env.PORT, "localhost", () => {
  console.log(`file watcher server running on port ${process.env.PORT}`);
});
