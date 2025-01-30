import express from "express";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../routes/authRoutes.js";
import User from "../models/User.js";

const router = express.Router();

// Subir CV - Protegido con autenticación
router.post("/upload-cv", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    const filePath = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.userId); // Obtener usuario autenticado

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.cvPath = filePath;
    await user.save();

    res.status(200).json({ message: "CV subido con éxito", filePath });
  } catch (error) {
    res.status(500).json({ message: "Error al subir el archivo", error });
  }
});

// Obtener el CV del usuario autenticado
router.get("/cv", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.cvPath) {
      return res.status(404).json({ message: "No hay CV disponible" });
    }
    res.json({ filePath: user.cvPath });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el CV", error });
  }
});
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
});

// Obtener estado del usuario
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      cvUploaded: user.cvPath ? true : false,
      cvAnalyzed: user.cvAnalysis ? true : false,
      softSkillsSurvey: user.softSkillsSurveyCompleted || false,
      hardSkillsSurvey: user.hardSkillsSurveyCompleted || false,
    });
  } catch (error) {
    console.error("Error al obtener estado del usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;