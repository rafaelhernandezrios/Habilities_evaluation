import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Asegúrate de importar connectDB

dotenv.config();

const app = express();
app.use(express.json());

// Configurar CORS utilizando una variable de entorno
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];

const corsOptions = {
  origin: allowedOrigins,
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