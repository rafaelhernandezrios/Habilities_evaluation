import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
      const { name, email, password, phone, dob, nationality, gender, institution, title, research_area, academic_level, student_id, semester, program } = req.body;

      // Verificar si el usuario ya existe
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "El usuario ya existe" });

      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Crear el usuario con los nuevos campos
      user = new User({
          name,
          email,
          password: hashedPassword,
          phone,
          dob,
          nationality,
          gender,
          institution,
          title,
          research_area,
          academic_level,
          student_id,
          semester,
          program
      });

      await user.save();
      res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
      console.error("Error en el registro:", error);
      res.status(500).json({ message: "Error en el servidor", error });
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar Token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, userId: user._id, name: user.name });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error });
  }
});

// Middleware para verificar el token
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    console.log("Token recibido en el backend:", token); // 🔹 Depuración
  
    if (!token) {
      return res.status(401).json({ message: "Acceso denegado, token requerido" });
    }
  
    try {
      const cleanToken = token.replace("Bearer ", "").trim(); // 🔹 Eliminar espacios extra
      console.log("Token limpio:", cleanToken); // 🔹 Mostrar token sin "Bearer"
  
      const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      console.error("Error verificando token:", error.message); // 🔹 Mostrar error exacto
      res.status(401).json({ message: "Token inválido" });
    }
  };
  
export { router as authRoutes, authMiddleware };
