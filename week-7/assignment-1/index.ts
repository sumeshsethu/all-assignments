import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
const port = 3000;
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

mongoose.connect('<INSTER MONGO DB URL>', { dbName: "TScourses" });  // Removed my personal MongoDB URL for safety
