require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

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
