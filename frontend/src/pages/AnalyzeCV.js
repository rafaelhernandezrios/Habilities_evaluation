import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AnalyzeCV = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: token },
        });

        if (response.data.questions) {
          setQuestions(response.data.questions);
        }
      } catch (error) {
        console.error("Error al obtener preguntas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // Prevent the default form submission reload
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/users/submit-interview",
        { answers },
        {
          headers: { Authorization: token, "Content-Type": "application/json" },
        }
      );

      setSubmitted(true);
      // Navigate back to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al enviar respuestas:", error);
    }
  };

  return (
    <div className="analyze-container">
      <h2>Entrevista Personalizada</h2>

      {loading ? (
        <p>Cargando preguntas...</p>
      ) : submitted ? (
        <p>✅ Respuestas enviadas con éxito.</p>
      ) : (
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
      )}
    </div>
  );
};

export default AnalyzeCV;
