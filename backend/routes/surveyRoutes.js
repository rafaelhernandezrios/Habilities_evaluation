import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../routes/authRoutes.js";

const router = express.Router();

// Guardar Encuesta de Habilidades Blandas
router.post("/soft-skills", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { softSkillsSurveyCompleted: true });
    res.status(200).json({ message: "Encuesta completada" });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});
router.post("/hard-skills", authMiddleware, async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.userId, { hardSkillsSurveyCompleted: true });
      res.status(200).json({ message: "Encuesta de habilidades duras completada" });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  });
  
export default router;
