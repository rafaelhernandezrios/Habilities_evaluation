import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true }, // Fecha de nacimiento
    nationality: { type: String, required: true },
    gender: { type: String, required: true },
    institution: { type: String, required: true },
    title: { type: String, required: true },
    research_area: { type: String, required: true },
    academic_level: { type: String, required: true },
    student_id: { type: String, required: true },
    semester: { type: String, required: true },
    program: { type: String, required: true },
    
    // 📂 CV y análisis
    cvPath: { type: String, default: "" },
    cvFile: { type: Buffer },
    cvText: { type: String },
    analysis: { type: String },
    skills: { type: Array, default: [] },
    questions: { type: Array, default: [] },
    score: { type: Number, default: 0 },
    cvAnalyzed: { type: Boolean, default: false },

    // 📊 Evaluaciones de habilidades
    softSkillsSurveyCompleted: { type: Boolean, default: false },
    hardSkillsSurveyCompleted: { type: Boolean, default: false },
    softSkillsResults: { type: Object, default: {} }, // 🆕 Guardar evaluación de habilidades blandas
    hardSkillsResults: { type: Object, default: {} }, // 🆕 Guardar evaluación de habilidades duras

    // 🗣️ Evaluación de entrevista
    interviewResponses: { type: Array, default: [] }, // 🆕 Guardar respuestas de la entrevista
    interviewScore: { type: Number, default: 0 }, // 🆕 Puntaje de la entrevista
    interviewAnalysis: { type: Array, default: [] }, // 🆕 Análisis detallado de las respuestas
    interviewCompleted: { type: Boolean, default: false }, // 🆕 Indica si la entrevista ha sido completada

    // 📅 Timestamp
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
