import express, { json } from "express";
import logger from "morgan";
import cors from "cors";
import fs from "fs";
import JSON5 from "json5";
import authRouter from "./routes/api/authRouter.js";
import productsRouter from "./routes/api/productsRouter.js";
import myProductsRouter from "./routes/api/myProductsRouter.js";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
const swaggerDocument = JSON5.parse(fs.readFileSync("./swagger.json", "utf-8"));

// Aplică middleware-ul CORS înainte de celelalte middleware-uri
app.use(
  cors({
    origin: ["http://localhost:3001", "https://fiorello69.github.io"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(logger(formatsLogger));
app.options("*", cors());
app.use(json());
// Rute
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/users", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/myProducts", myProductsRouter);

// Servire fișiere statice
app.use(express.static("public"));

// Gestionare rute neidentificate
app.use((_, res) => res.status(404).json({ message: "Not Found" }));

// Gestionare erori
app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server internal error" } = err;
  res.status(status).json({ message });
});

export default app;
