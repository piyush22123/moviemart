const express = require("express");
const cookieParser = require("cookie-parser");
const cors =  require("cors");

const authRoute = require("./routes/auth.route.js");
const movieRoute = require("./routes/movie.route.js");

const app = express();
app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    "https://moviemart-nine.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/movie", movieRoute);


module.exports = app;