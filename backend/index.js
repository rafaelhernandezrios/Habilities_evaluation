import express from "express";
import mongoose from "mongoose";
import cors from "cors";  // ✅ Solo necesitas esta línea para importar CORS
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js"; 

dotenv.config();

const app = express();
app.use(express.json());

// Configurar CORS para permitir peticiones desde el frontend
const corsOptions = {
  origin: ["http://localhost:3000", "https://habilities-evaluation-1.onrender.com"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

// Conectar a la base de datos
connectDB();

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Ruta de prueba
app.get("/api/test", (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

// Definir rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
