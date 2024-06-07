import express from "express";
import path from "path"; // Import path module for dirname
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productsRoute.js";

// Config env
dotenv.config();

// Database config
connectDB();

// Rest object
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/products", productRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve(); // Get current directory

  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Rest API
app.get("/", (req, res) => {
  res.send("<h1>Welcome to first Mern</h1>");
});

const PORT = process.env.PORT || 8000;
// Run listen
app.listen(PORT, () => {
  console.log(
    `Server running on mode ${process.env.DEV_MODE} on ${PORT}`.bgCyan.white
  );
});
