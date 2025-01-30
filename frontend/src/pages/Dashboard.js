import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Dashboard.css"; // Asegúrate de tener el CSS correcto

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Obtener datos del usuario
        const userResponse = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: token },
        });
        setUser(userResponse.data);

        // Obtener estado del usuario
        const statusResponse = await axios.get("http://localhost:5000/api/users/status", {
          headers: { Authorization: token },
        });
        setStatus(statusResponse.data);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-title">Dashboard</h2>

        {user && status ? (
          <div className="dashboard-info">
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            {/* Estado del CV */}
            <p><strong>CV:</strong> {status.cvUploaded ? "✅ Subido" : "❌ No subido"}</p>
            {!status.cvUploaded && <a href="/upload-cv" className="btn btn-warning w-100">Subir CV</a>}

            {/* Estado del Análisis del CV */}
            <p><strong>Etrevista Personalizada:</strong> {status.cvAnalyzed ? "✅ Realizado" : "❌ No realizado"}</p>
            {!status.cvAnalyzed && <a href="/analyze-cv" className="btn btn-info w-100">Analizar CV y generar Entrevista</a>}

            {/* Estado de la Encuesta de Habilidades Blandas */}
            <p><strong>Encuesta de Habilidades Blandas:</strong> {status.softSkillsSurvey ? "✅ Completada" : "❌ No completada"}</p>
            {!status.softSkillsSurvey && <a href="/soft-skills" className="btn btn-success w-100">Completar Encuesta</a>}

            {/* Estado de la Encuesta de Habilidades Duras */}
            <p><strong>Encuesta de Habilidades Duras:</strong> {status.hardSkillsSurvey ? "✅ Completada" : "❌ No completada"}</p>
            {!status.hardSkillsSurvey && <a href="/hard-skills" className="btn btn-success w-100">Completar Encuesta</a>}
          </div>
        ) : (
          <p className="text-muted">Cargando datos...</p>
        )}

        <div className="dashboard-buttons">
          <button onClick={handleLogout} className="btn btn-danger w-100">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
