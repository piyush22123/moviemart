require("dotenv").config();
const app = require("./src/app.js");
const connectDB = require("./src/services/db.js");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Connect Database
        await connectDB();
        console.log("Database connected successfully");

        // Start Server
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();

