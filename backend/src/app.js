const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRoute = require("./routes/auth.route.js");
const movieRoute = require("./routes/movie.route.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS is needed only for local development. In production, the frontend
// and API are served from the same Render origin.
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/movie", movieRoute);

// Serve the production React build from the same Node/Express service.
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
app.use(express.static(frontendDistPath));

// Return JSON for unknown API endpoints instead of the React index.html.
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// React Router fallback for client-side routes (Express 5 compatible).
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

module.exports = app;
