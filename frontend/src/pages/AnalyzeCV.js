import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AnalyzeCV.css"; // Asegúrate de tener este archivo para los estilos

const AnalyzeCV = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Estado para animación del avatar
  const navigate = useNavigate();

  useEffect(() => {
    const analyzeCV = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await axios.post(
          "http://14.10.2.192:20352/api/users/analyze-cv",
          {},
          { headers: { Authorization: token } }
        );

        const { questions } = response.data;
        setQuestions(questions || []);
        setAnswers(new Array(questions.length).fill("")); 

        if (questions.length > 0) {
          speakQuestion(questions[0]); 
        }
      } catch (error) {
        console.error("Error analizando el CV:", error);
      } finally {
        setLoading(false);
      }
    };

    analyzeCV();
  }, []);

  // 🔊 Hablar y animar avatar
  const speakQuestion = (question) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.lang = "es-US"; 

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Tu navegador no soporta Web Speech API");
    }
  };

  const handleAnswerChange = (event) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      speakQuestion(questions[nextIndex]); 
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://14.10.2.192:20352/api/users/submit-interview",
        { answers },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSubmitted(true);
        setTimeout(() => navigate("/interview-results"), 2000); 
      }
    } catch (error) {
      console.error("Error al enviar respuestas:", error);
    }
  };

  if (loading) {
    return <p>Cargando análisis de CV...</p>;
  }

  if (submitted) {
    return <p>✅ Respuestas enviadas con éxito. Redirigiendo a resultados...</p>;
  }

  return (
    <div className="analyze-container">
      <h2>Entrevista Personalizada</h2>

      {/* Avatar animado */}
      <div className={`avatar ${isSpeaking ? "speaking" : ""}`} />

      {questions.length > 0 ? (
        <div className="question-container">
          <p className="question-text">{questions[currentQuestionIndex]}</p>
          <input
            type="text"
            className="answer-input"
            value={answers[currentQuestionIndex] || ""}
            onChange={handleAnswerChange}
            required
          />
          <button onClick={handleNextQuestion} className="btn btn-primary mt-3">
            {currentQuestionIndex < questions.length - 1 ? "Siguiente Pregunta" : "Finalizar Entrevista"}
          </button>
        </div>
      ) : (
        <p>No hay preguntas generadas.</p>
      )}
    </div>
  );
};

export default AnalyzeCV;
