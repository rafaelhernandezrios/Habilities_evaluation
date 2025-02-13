import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Asegúrate de importar connectDB

dotenv.config();

const app = express();
app.use(express.json());

// Configurar CORS correctamente
const corsOptions = {
  origin: [
    "http://localhost:20353", 
    "http://14.10.2.192:20353", 
    "https://habilities-evaluation-1.onrender.com",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

// Conectar a la base de datos
connectDB(); // Asegúrate de llamar a connectDB aquí

// Registrar las rutas
import {authRoutes} from "./routes/authRoutes.js"; 
import surveyRoutes from "./routes/surveyRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 20352;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});