import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productsRoute.js";

//config env
//paramter a path dite hobe.root dekhe path deya lage nai
dotenv.config();
//databse config
connectDB();

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/products", productRoutes);
///// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to first Mern</h1>");
});

const PORT = process.env.PORT || 8000;
//run listen
app.listen(PORT, () => {
  console.log(
    `server Running on mode ${process.env.DEV_MODE} on ${PORT}`.bgCyan.white
  );
});
