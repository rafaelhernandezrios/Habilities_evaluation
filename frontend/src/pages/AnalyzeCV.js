import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AnalyzeCV = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const navigate = useNavigate();

  // 1) On mount, call POST /analyze-cv
  useEffect(() => {
    const analyzeCV = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/analyze-cv",
          {},
          {
            headers: { Authorization: token },
          }
        );
        // This returns { questions, score, userId, ... } per your route
        const { questions } = response.data;
        setQuestions(questions || []);
        setAnalyzed(true);
      } catch (error) {
        console.error("Error analyzing CV:", error);
      } finally {
        setLoading(false);
      }
    };

    analyzeCV();
  }, []);

  // 2) Let the user fill in the answers to the questions
  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  // 3) On submit, call POST /submit-interview
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/users/submit-interview",
        { answers },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setSubmitted(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al enviar respuestas:", error);
    }
  };

  // 4) Render
  if (loading) {
    return <p>Cargando análisis de CV...</p>;
  }

  if (!analyzed) {
    return (
      <p>
        Ocurrió un problema analizando tu CV. Por favor revisa la consola o
        intenta de nuevo.
      </p>
    );
  }

  if (submitted) {
    return <p>✅ Respuestas enviadas con éxito. ¡Gracias!</p>;
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
