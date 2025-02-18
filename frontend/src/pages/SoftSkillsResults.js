// src/pages/SoftSkillsResults.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/SoftSkillsResults.css";

const SoftSkillsResults = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/me`, {
          headers: { Authorization: token },
        });
        // "softSkillsResults" lo guardaste en el backend como user.softSkillsResults
        setResults(response.data.softSkillsResults || {});
      } catch (error) {
        console.error("Error al obtener resultados de Soft Skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <div>Cargando resultados...</div>;
  }

  // Si no hay nada en results, mostrar un mensaje
  if (!results || Object.keys(results).length === 0) {
    return <div>No se encontraron resultados de Habilidades Blandas.</div>;
  }

  return (
    <div className="results-container">
      <div className="results-card">
        <h2 className="results-title">Resultados de Habilidades Blandas</h2>
  
        <ul className="results-list">
          {Object.entries(results).map(([skill, data]) => (
            <li key={skill}>
              <span className="results-skill-name">{skill}</span>:{" "}
              <span className="results-skill-score">
                {data.level}
              </span>
            </li>
          ))}
        </ul>
  
        {/* Ejemplo de botón para volver al dashboard */}
        <a href="/dashboard" className="btn btn-primary">Regresar</a>
      </div>
    </div>
  );
};

export default SoftSkillsResults;
