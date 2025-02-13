import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AnalyzeCV = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const navigate = useNavigate();

  // 1) Cargar preguntas al montar el componente
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
        setAnswers(new Array(questions.length).fill("")); // Inicializar respuestas como array vacío
        setAnalyzed(true);
      } catch (error) {
        console.error("Error analizando el CV:", error);
      } finally {
        setLoading(false);
      }
    };

    analyzeCV();
  }, []);

  // 2) Manejar cambio en respuestas
  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  // 3) Enviar respuestas
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://14.10.2.192:20352/api/users/submit-interview",
        { answers }, // Asegurar que es un array
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSubmitted(true);
        setTimeout(() => navigate("/interview-results"), 2000); // Redirigir después de 2s
      }
    } catch (error) {
      console.error("Error al enviar respuestas:", error);
    }
  };

  // 4) Renderizado
  if (loading) {
    return <p>Cargando análisis de CV...</p>;
  }

  if (!analyzed) {
    return <p>Ocurrió un problema analizando tu CV. Por favor intenta de nuevo.</p>;
  }

  if (submitted) {
    return <p>✅ Respuestas enviadas con éxito. Redirigiendo a resultados...</p>;
  }

  return (
    <div className="analyze-container">
      <h2>Entrevista Personalizada</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index}>
            <p>{question}</p>
            <input
              type="text"
              value={answers[index] || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              required
            />
          </div>
        ))}

        <button type="submit" className="btn btn-primary mt-3">
          Enviar Respuestas
        </button>
      </form>
    </div>
  );
};

export default AnalyzeCV;
