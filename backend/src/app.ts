import express, { Express, RequestHandler, ErrorRequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRouter from "./api/routes";
import { errorHandler } from "./api/middlewares/errorHandler";
import { initializeVectorStore } from "./core/ai/rag/ingestion.service";

const app: Express = express();

// Initialize the in-memory vector store on startup
initializeVectorStore().catch(console.error);

// Middleware
const allowedOrigin =
  process.env.FRONTEND_ORIGIN ||
  process.env.VITE_DEV_ORIGIN ||
  "http://localhost:5173";
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? allowedOrigin : true,
    credentials: true,
  })
);
// Middleware
app.use(express.json() as RequestHandler);
app.use(cookieParser() as RequestHandler);

// API Routes
// API Routes
app.use("/api", apiRouter as RequestHandler);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error Handling Middleware: use the appropriate ErrorRequestHandler type directly
app.use(errorHandler as ErrorRequestHandler);

export default app;
