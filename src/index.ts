import "dotenv/config";
import express from "express";
import passwordRoutes from "./routes/passwordRoutes";
import userRoutes from "./routes/userRoutes";
import connectDB from "./config/dbConnect";

const PORT = 3000;

const app = express();
app.use(express.json());
app.use("/auth", userRoutes);
app.use("/password", passwordRoutes);

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
