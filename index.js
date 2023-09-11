require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const path = require("path");
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

if (!fs.existsSync("uploads")) {
  try {
    fs.mkdirSync("uploads", { recursive: true });
  } catch (err) {
    console.log("Somthing went wrong while createing uploads directory!");
  }
}

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log("We are live on port " + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
