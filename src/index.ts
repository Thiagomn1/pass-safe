import express from "express";
import passwordRoutes from "./routes/passwordRoutes";

const PORT = 3000;

const app = express();
app.use(express.json(), passwordRoutes);

app.get("/", (req, res) => {
  res.send("Password Manager API");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
