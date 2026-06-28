import dotenv from "dotenv";
dotenv.config();

import express from "express";

import connectDB from "./src/config/dbConnection.config.js";
import authRouter from "./src/routers/auth.route.js";
import publicRouter from "./src/routers/public.route.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

app.use(morgan("dev"));

app.use(express.json());

app.use("/auth", authRouter);
app.use("public", publicRouter);

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
