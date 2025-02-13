import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/InterviewResults.css"; // Asegúrate de crear este archivo CSS para estilos personalizados.

const InterviewResults = () => {
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://14.10.2.192:20352/api/users/interview-responses", {
          headers: { Authorization: token },
        });
        setInterviewData(response.data);
      } catch (err) {
        setError("No se encontraron respuestas de entrevista.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Resultados de la Entrevista</h2>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}

      {interviewData && (
        <div className="mt-4">
          <h3>Puntaje de la Entrevista: <span className="text-primary">{interviewData.score}/100</span></h3>
          
          <h4 className="mt-3">Preguntas y Respuestas:</h4>
          <ul className="list-group">
            {interviewData.questions.map((question, index) => (
              <li key={index} className="list-group-item">
                <strong>Pregunta:</strong> {question} <br />
                <strong>Respuesta:</strong> {interviewData.responses[index]}
              </li>
            ))}
          </ul>

          <h4 className="mt-4">Análisis de GPT:</h4>
          <ul className="list-group">
            {interviewData.analysis.map((item, index) => (
              <li key={index} className="list-group-item">
                <strong>Puntaje:</strong> {item.score} <br />
                <strong>Comentario:</strong> {item.explanation}
              </li>
            ))}
          </ul>

          <button className="btn btn-primary mt-3" onClick={() => navigate("/dashboard")}>
            Volver al Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewResults;
