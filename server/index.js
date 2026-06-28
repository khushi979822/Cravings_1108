import dotenv from "dotenv";
dotenv.config();

import express from "express";

import connectDB from "./src/config/dbConnection.config.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(express.json());

// Default API
app.get("/", (req, res) => {
  console.log("Default Get API Hit");
  res.json({ message: "Welcome to My Craving Project" });
});

// Default error handler
app.use((err, req, res, next) => {
  const ErrMessage = err.message || "Internal Server Error";
  const ErrStatusCode = err.statusCode || 500;

  res.status(ErrStatusCode).json({ message: ErrMessage });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server Started on port : ", port);
  connectDB();
});
