import "dotenv/config";
import express from "express";
import passwordRoutes from "./routes/passwordRoutes";
import userRoutes from "./routes/userRoutes";
import connectDB from "./config/dbConnect";
import errorHandler from "./middleware/errorHandler";
import cors from "cors";
import cookieParser from "cookie-parser";

const PORT = 3000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api", userRoutes);
app.use("/api/password", passwordRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Password Manager API");
});

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

startServer();
