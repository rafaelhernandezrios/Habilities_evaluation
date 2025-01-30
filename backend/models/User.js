import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    institution: { type: String, required: true },
    title: { type: String, required: true },
    research_area: { type: String, required: true },
    cvPath: { type: String }, // Ruta del archivo PDF subido
    skills: { type: Array, default: [] }, // Habilidades extraídas del CV
    score: { type: Number, default: 0 }, // Puntaje basado en el CV

    // Estado del Análisis del CV con GPT
    cvAnalyzed: { type: Boolean, default: false },

    // Estado de Encuestas de Habilidades
    softSkillsSurveyCompleted: { type: Boolean, default: false }, // Encuesta de habilidades blandas
    hardSkillsSurveyCompleted: { type: Boolean, default: false }, // Encuesta de habilidades duras

    // Fecha de creación del usuario
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
