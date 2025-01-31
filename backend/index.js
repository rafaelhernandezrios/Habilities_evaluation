import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import { authRoutes } from "./routes/authRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js"; // Asegurar que está importado



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a la base de datos
connectDB();
// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: "API funcionando correctamente" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes); // Registrar la ruta correctamente