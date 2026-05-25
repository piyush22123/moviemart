const express = require("express");
const cookieParser = require("cookie-parser");
const cors =  require("cors");

const authRoute = require("./routes/auth.route.js");
const movieRoute = require("./routes/movie.route.js");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/movie", movieRoute);


module.exports = app;