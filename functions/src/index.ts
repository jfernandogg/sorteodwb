import express from "express";
import {getDatabase} from "../../src/lib/firebaseServer";
import cors from "cors";
import {Request, Response} from "express";

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const collections = await db.listCollections().toArray();
    res.json({
      status: "API is working",
      database: "Connected to MongoDB",
      collections: collections.map(
        (c) => c.name
      ),
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({error: "Database connection failed"});
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGO_URI || "mongodb://localhost:27017/sorteodb"}`);
});
