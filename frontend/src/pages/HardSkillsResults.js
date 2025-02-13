// src/pages/HardSkillsResults.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/HardSkillsResults.css";

const HardSkillsResults = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://14.10.2.192:20352/api/users/me", {
          headers: { Authorization: token },
        });
        // "softSkillsResults" lo guardaste en el backend como user.softSkillsResults
        setResults(response.data.hardSkillsResults || {});
      } catch (error) {
        console.error("Error al obtener resultados de Hard Skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <div>Cargando resultados...</div>;
  }

  return (
    <div className="results-container">
      <div className="results-card">
        <h2 className="results-title">Resultados de Inteligencias Multiples</h2>
  
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


export default HardSkillsResults;
