const path = require("path");
const express = require("express");
const compression = require("compression");
const dotenv = require("dotenv");
const connectDB = require("./dbConnect/dbConnect");

const utilities = require("./utils/utilities");

const app = express();
dotenv.config();

const folderPath = "./images";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

async function dbConn() {
  await connectDB.init();
}

dbConn();

utilities.watchFiles(folderPath);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ success: false, message: message });
});

app.listen(process.env.PORT, "localhost", () => {
  console.log(`file watcher server running on port ${process.env.PORT}`);
});
