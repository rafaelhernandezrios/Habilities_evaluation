import express from "express";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises"; // For async operations like fsPromises.mkdir, fsPromises.writeFile
import { fileURLToPath } from "url";

import { authMiddleware } from "../routes/authRoutes.js";
import upload from "../middleware/upload.js";
import dotenv from "dotenv";
import User from "../models/User.js";

// Import your utilities from cvUtils
import {
  extractTextFromPdf,
  analyzeCvText,
  generateQuestions,
  evaluateSoftSkills,
  evaluateMultipleIntelligences,
  calculateScore,
  calculateScoreBasedOnAnswers,
} from "../utils/cvUtils.js"; // Adjust the import path as needed

dotenv.config();
const router = express.Router();

// Handy for building absolute paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//--------------------------------------//
// Upload CV (Protected) to Disk        //
//--------------------------------------//
// Ruta para subir CV
router.post("/upload-cv", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("❌ No se recibió el archivo.");
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    console.log("✅ Archivo recibido:", req.file);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Save S3 file location
    user.cvPath = req.file.location; // S3 returns the file URL in location
    await user.save();

    return res.status(200).json({
      message: "CV subido correctamente",
      filePath: user.cvPath,
    });
  } catch (error) {
    console.error("❌ Error al subir el archivo:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

//--------------------------------------//
// Get the CV path of the authenticated //
// user (if any)                        //
//--------------------------------------//
router.get("/cv", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.cvPath) {
      return res.status(404).json({ message: "No CV available" });
    }

    // Return the file path stored in the database
    res.json({ filePath: user.cvPath });
  } catch (error) {
    console.error("Error fetching CV:", error);
    res.status(500).json({ message: "Error fetching CV", error });
  }
});

//-------------------------//
// Get current user (me)   //
//-------------------------//
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching the user", error });
  }
});

//-----------------------------------------//
// Get user status (CV upload, analysis)   //
//-----------------------------------------//
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      cvUploaded: !!user.cvPath,
      cvAnalyzed: user.cvAnalyzed || false,
      softSkillsSurvey: user.softSkillsSurveyCompleted || false,
      hardSkillsSurvey: user.hardSkillsSurveyCompleted || false,
    });
  } catch (error) {
    console.error("Error fetching user status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//----------------------------------------//
// Analyze CV Endpoint                    //
//----------------------------------------//
router.post("/analyze-cv", authMiddleware, async (req, res) => {
  try {
    console.log("Iniciando análisis de CV para el usuario:", req.userId);

    const user = await User.findById(req.userId);
    if (!user || !user.cvPath) {
      return res.status(404).json({ message: "No CV stored for analysis" });
    }

    // Eliminar la verificación de archivo local ya que el archivo está en S3
    // En su lugar, intentar extraer texto directamente desde la URL de S3
    const cvText = await extractTextFromPdf(user.cvPath);

    // 3. Analyze with GPT to get a summary or skill list
    const analysisResult = await analyzeCvText(cvText);

    // 4. Convert the analysis text into an array of skills
    //    This depends on how 'analysisResult' is structured.
    //    For now, assume it's a comma-separated list of skills or something similar.
    const allSkills = analysisResult
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    // 5. Generate interview questions
    const questions = await generateQuestions(allSkills);

    // 6. Calculate a skill-based score
    const score = Math.min(allSkills.length * 10, 100);

    // 7. Save to the DB
    user.cvText = cvText;
    user.analysis = analysisResult;
    user.skills = allSkills;
    user.questions = questions;
    user.score = score;
    user.cvAnalyzed = true;

    await user.save();

    console.log("CV analizado con éxito para el usuario:", user._id);
    res.json({ 
      message: "CV analizado con éxito", 
      userId: user._id,
      questions,
      score
    });
  } catch (error) {
    console.error("Error procesando CV:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//-------------------------------------------//
// 📌 Guardar respuestas de entrevista en DB //
//-------------------------------------------//
router.post("/submit-interview", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "No se enviaron respuestas válidas" });
    }

    // Obtener preguntas del usuario
    const questions = user.questions || [];
    if (questions.length !== answers.length) {
      return res.status(400).json({ message: "Número de respuestas no coincide con las preguntas." });
    }

    // Evaluar respuestas usando GPT
    const { total_score, evaluations } = await calculateScoreBasedOnAnswers(questions, answers);

    // Guardar evaluación en la base de datos del usuario
    user.interviewResponses = answers; // 🆕 Guardamos las respuestas del usuario
    user.interviewScore = total_score;
    user.interviewAnalysis = evaluations;
    user.interviewCompleted = true;

    await user.save();

    return res.json({
      message: "Entrevista evaluada y almacenada con éxito",
      total_score,
      evaluations,
    });

  } catch (error) {
    console.error("Error al procesar la entrevista:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

//-------------------------------------------//
// 📌 Obtener respuestas de entrevista       //
//-------------------------------------------//
router.get("/interview-responses", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.interviewResponses) {
      return res.status(404).json({ message: "No hay respuestas almacenadas." });
    }

    return res.json({
      questions: user.questions,
      responses: user.interviewResponses,
      analysis: user.interviewAnalysis,
      score: user.interviewScore,
    });

  } catch (error) {
    console.error("Error al obtener respuestas de entrevista:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});
router.post("/submit-soft-skills", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { responses } = req.body;

    if (!responses) {
      return res.status(400).json({ message: "No se enviaron respuestas" });
    }

    // Evaluar las habilidades blandas
    const evaluation = evaluateSoftSkills(responses);

    // Guardar en la base de datos
    user.softSkillsResults = evaluation.results;
    user.score = evaluation.totalScore;
    user.softSkillsSurveyCompleted = true;

    await user.save();

    res.json({
      message: "Encuesta de habilidades blandas guardada exitosamente",
      results: evaluation.results,
      totalScore: evaluation.totalScore,
    });
  } catch (error) {
    console.error("Error al procesar la encuesta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});
router.post("/submit-hard-skills", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { responses } = req.body;

    if (!responses) {
      return res.status(400).json({ message: "No se enviaron respuestas" });
    }

    // Evaluar inteligencias múltiples
    const evaluation = evaluateMultipleIntelligences(responses);

    // Guardar en la base de datos
    user.hardSkillsResults = evaluation.results;
    user.score = evaluation.totalScore;
    user.hardSkillsSurveyCompleted = true;

    await user.save();

    res.json({
      message: "Cuestionario de inteligencias múltiples guardado exitosamente",
      results: evaluation.results,
      totalScore: evaluation.totalScore,
    });
  } catch (error) {
    console.error("Error al procesar el cuestionario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
