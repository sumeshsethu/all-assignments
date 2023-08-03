"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
mongoose_1.default.connect('mongodb+srv://sumeshsethus:iRv9hBFuJUg5bNmu@cluster0.g3qb2xf.mongodb.net/courses', { dbName: "TScourses" });
