import fs from "fs/promises";
import pdf from "pdf-parse";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// Make sure you set process.env.OPENAI_API_KEY or pass it to new OpenAI({ apiKey: ... }).
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Extract text from a local PDF file using pdf-parse.
 */
export async function extractTextFromPdf(pdfPath) {
  // Read the PDF into a buffer
  const pdfBuffer = await fs.readFile(pdfPath);
  // Parse PDF with pdf-parse
  const data = await pdf(pdfBuffer);
  return data.text.trim();
}
export const evaluateMultipleIntelligences = (responses) => {
    const intelligences = {
      "Inteligencia Comunicativa": [9, 10, 17, 22, 30],
      "Inteligencia Matemática": [5, 7, 15, 20, 25],
      "Inteligencia Visual": [1, 11, 14, 23, 27],
      "Inteligencia Motriz": [8, 16, 19, 21, 29],
      "Inteligencia Rítmica": [3, 4, 13, 24, 28],
      "Inteligencia de Autoconocimiento": [2, 6, 26, 31, 33],
      "Inteligencia Social": [12, 18, 32, 34, 35],
    };
  
    const scoreLevels = {
      "Nivel bajo": [2, 2],   // 2 respuestas verdaderas
      "Nivel medio": [3, 3],  // 3 respuestas verdaderas
      "Nivel alto": [4, 5],   // 4 o más respuestas verdaderas
    };
  
    let results = {};
    let totalScore = 0;
  
    for (const [intelligence, questionNumbers] of Object.entries(intelligences)) {
      let countTrue = questionNumbers.filter((qNum) => responses[qNum] === "5").length;
      totalScore += countTrue * 5;
  
      // Asignar nivel según cantidad de respuestas "Verdadero"
      let level = "Nivel bajo";
      for (const [levelName, range] of Object.entries(scoreLevels)) {
        if (countTrue >= range[0] && countTrue <= range[1]) {
          level = levelName;
          break;
        }
      }
  
      results[intelligence] = { score: countTrue * 5, level };
    }
  
    return { totalScore, results };
  };
  
export const evaluateSoftSkills = (responses) => {
    const competencies = {
      "Pensamiento Analítico": [1, 21, 41, 61, 81, 101, 121, 141],
      "Respuesta ante los problemas": [2, 22, 42, 62, 82, 102, 122, 142],
      "Iniciativa": [3, 23, 43, 63, 83, 103, 123, 143],
      "Autodominio": [4, 24, 44, 64, 84, 104, 124, 144],
      "Afrontamiento al estrés": [5, 25, 45, 65, 85, 105, 125, 145],
      "Socialización": [6, 26, 46, 66, 86, 106, 126, 146],
      "Contribución": [7, 27, 47, 67, 87, 107, 127, 147],
      "Habilidad verbal": [8, 28, 48, 68, 88, 108, 128, 148],
      "Principios morales": [9, 29, 49, 69, 89, 109, 129, 149],
      "Compromiso": [10, 30, 50, 70, 90, 110, 130, 150],
    };
  
    const scoreLevels = {
      "Nivel muy bajo": [0, 78],
      "Nivel bajo": [79, 85],
      "Nivel medio": [86, 105],
      "Nivel alto": [106, 115],
      "Nivel muy alto": [116, 120],
    };
  
    let results = {};
    let totalScore = 0;
  
    for (const [competency, questionNumbers] of Object.entries(competencies)) {
      let sum = questionNumbers.reduce((acc, qNum) => acc + (responses[qNum] || 0), 0);
      totalScore += sum;
  
      // Asignar nivel de competencia basado en los puntajes
      let level = "Nivel muy bajo";
      for (const [levelName, range] of Object.entries(scoreLevels)) {
        if (sum >= range[0] && sum <= range[1]) {
          level = levelName;
          break;
        }
      }
  
      results[competency] = { score: sum, level };
    }
  
    return { totalScore, results };
  };
  
/**
 * Analyze CV text using OpenAI GPT, extracting hard/soft skills and experience.
 */
export async function analyzeCvText(text) {
    try {
      console.log("Enviando texto del CV a OpenAI...");
  
      // Reemplaza "gpt-4o-mini" con un modelo más estable si es necesario
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Alternativa: "gpt-3.5-turbo"
        messages: [
          { role: "system", content: "Eres un experto en análisis de currículums." },
          { role: "user", content: `Extrae las habilidades duras y blandas así como la experiencia más relevantes del siguiente CV:\n\n${text}` },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });
  
      // Verificar si la respuesta es válida
      if (!response || !response.choices || !response.choices[0].message) {
        throw new Error("Respuesta inesperada de OpenAI");
      }
  
      const extractedText = response.choices[0].message.content.trim();
  
      console.log("Resultado de OpenAI:", extractedText);
  
      return extractedText;
    } catch (error) {
      console.error("Error en analyzeCvText:", error);
      return "Error en el análisis del CV.";
    }
  }
  

/**
 * Generate 3 hard-skill questions and 2 soft-skill questions.
 * Hard-coded skill classification, or adapt as you see fit.
 */
export async function generateQuestions(skills) {
  const hardSkillCandidates = ["Python", "Machine Learning", "Data Analysis"];
  const softSkillCandidates = ["Teamwork", "Communication"];

  // Separate recognized skills into arrays
  let hard_skills = skills.filter(skill =>
    hardSkillCandidates.map(s => s.toLowerCase()).includes(skill.toLowerCase())
  );
  let soft_skills = skills.filter(skill =>
    softSkillCandidates.map(s => s.toLowerCase()).includes(skill.toLowerCase())
  );

  // Ensure we have at least 3 hard skills
  while (hard_skills.length < 3) {
    // Add placeholders from the candidate list if needed
    const needed = 3 - hard_skills.length;
    hard_skills = [...hard_skills, ...hardSkillCandidates.slice(0, needed)];
  }

  // Ensure we have at least 2 soft skills
  while (soft_skills.length < 2) {
    const needed = 2 - soft_skills.length;
    soft_skills = [...soft_skills, ...softSkillCandidates.slice(0, needed)];
  }

  // Build a prompt to generate exactly 5 questions
  const prompt = `
A continuación, se proporcionan habilidades duras y blandas.
Genera 3 preguntas específicas para las habilidades duras y 2 preguntas específicas para las blandas.
Proporciona exactamente 5 preguntas numeradas, sin texto adicional.

Habilidades duras:
${hard_skills.join(", ")}

Habilidades blandas:
${soft_skills.join(", ")}
`;

  // Call GPT
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Or "gpt-3.5-turbo"
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
    temperature: 0.7,
  });

  // Split response into lines
  let questions = response.choices[0].message.content
    .split("\n")
    .map(q => q.trim())
    .filter(Boolean);

  // If fewer than 5 lines, pad with placeholders
  while (questions.length < 5) {
    questions.push(`${questions.length + 1}. Pregunta genérica de ejemplo.`);
  }

  // Return only 5 lines
  return questions.slice(0, 5);
}

/**
 * Simple function to calculate a score based on detected skills.
 */
export function calculateScore(skills) {
  const skillWeights = {
    Python: 10,
    "Machine Learning": 15,
    "Data Analysis": 12,
    Teamwork: 8,
    Communication: 5,
  };

  const uniqueSkills = new Set(skills.map(s => s.trim()));
  let totalScore = 0;

  uniqueSkills.forEach(skill => {
    // If skill is in the dictionary, use that weight; otherwise, default 5
    totalScore += skillWeights[skill] || 5;
  });

  // Cap at 100
  return Math.min(totalScore, 100);
}

/**
 * Calculates a score based on user's interview answers, returning a final score & explanations.
 */
export function calculateScoreBasedOnAnswers(questions, answers) {
  // Hard-coded skill keywords
  const skillKeywords = {
    hard_skills: {
      Python: ["programming", "automation", "python", "scripting"],
      "Machine Learning": ["models", "ai", "algorithms", "deep learning", "machine learning"],
      "Data Analysis": ["statistics", "visualization", "pandas", "data analysis"],
    },
    soft_skills: {
      Communication: ["collaboration", "communication", "listening", "presentation"],
      Teamwork: ["team", "cooperation", "leadership", "support", "helping"],
    },
  };

  // Weights per category
  const weights = {
    hard_skills: 15,
    soft_skills: 10,
  };

  let total_score = 0;
  let explanations = [];
  let evaluated_skills = new Set();

  // Go through each Q&A
  for (let i = 0; i < questions.length; i++) {
    const answer = answers[i] || "";
    const answerLower = answer.toLowerCase();

    // Check each skill
    for (const [category, skills] of Object.entries(skillKeywords)) {
      for (const [skill, keywords] of Object.entries(skills)) {
        // If not already counted, and at least one keyword is found in the answer
        if (
          !evaluated_skills.has(skill) &&
          keywords.some(keyword => answerLower.includes(keyword))
        ) {
          // Add points, mark skill as used
          total_score += weights[category];
          evaluated_skills.add(skill);
          explanations.push(
            `La respuesta '${answer}' demuestra conocimiento en '${skill}' (+${weights[category]} puntos).`
          );
        }
      }
    }
  }

  // Cap at 100
  total_score = Math.min(total_score, 100);

  if (total_score === 0) {
    explanations.push("No se detectaron habilidades relevantes en las respuestas.");
  } else {
    explanations.push(`El puntaje total se calculó como ${total_score} sobre 100.`);
  }

  return { total_score, explanations };
}
