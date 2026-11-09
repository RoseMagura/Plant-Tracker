import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import plantRoutes from "./routes/plantRoutes";

// Load environment variables from a .env file if present
dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Interface for API responses (good practice for typing payloads)
interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

// Routes
app.get("/api/health", (req: Request, res: Response<HealthResponse>) => {
  res.json({
    status: "ok",
    message: "TypeScript Express backend is running smoothly!",
    timestamp: new Date().toISOString(),
  });
});

// Mount the plant routes under /api/plants
app.use("/api/plants", plantRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
