import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Selecciona un archivo PDF.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/users/upload-cv", formData, {
        headers: { "Authorization": token, "Content-Type": "multipart/form-data" },
      });
      setMessage("CV subido con éxito.");
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      setMessage("Error al subir el archivo.");
    }
  };

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

            {/* Estado del CV con Modal de Carga */}
            <p><strong>CV:</strong> {status.cvUploaded ? "✅ Subido" : "❌ No subido"}</p>
            {!status.cvUploaded && (
              <button className="btn btn-warning w-100" onClick={() => setShowModal(true)}>
                Subir CV
              </button>
            )}

            {/* Estado de la Entrevista Personalizada (Análisis GPT) */}
            <p><strong>Entrevista Personalizada:</strong> {status.cvAnalyzed ? "✅ Realizado" : "❌ No realizado"}</p>
            {!status.cvAnalyzed && <a href="/analyze-cv" className="btn btn-info w-100">Analizar CV y generar Entrevista</a>}

            {/* Estado de la Encuesta de Habilidades Blandas */}
            <p>
              <strong>Encuesta de Habilidades Blandas:</strong>{" "}
              {status.softSkillsSurvey ? "✅ Completada" : "❌ No completada"}
            </p>

            {status.softSkillsSurvey ? (
              // Si está completada, muestro un link a la página de resultados
              <a href="/soft-skills-results" className="btn btn-secondary w-100">
                Ver Resultados
              </a>
            ) : (
              // Si NO está completada, muestro el link para completarla
              <a href="/soft-skills" className="btn btn-success w-100">
                Completar Encuesta
              </a>
            )}

            {/* Estado de la Encuesta de Habilidades Duras */}
            <p>
              <strong>Encuesta de Inteligencias Multiples:</strong>{" "}
              {status.hardSkillsSurvey ? "✅ Completada" : "❌ No completada"}
            </p>

            {status.hardSkillsSurvey ? (
              // Si está completada, muestro un link a la página de resultados
              <a href="/hard-skills-results" className="btn btn-secondary w-100">
                Ver Resultados
              </a>
            ) : (
              // Si NO está completada, muestro el link para completarla
              <a href="/hard-skills" className="btn btn-success w-100">
                Completar Encuesta
              </a>
            )}
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

      {/* Modal de Subida de CV */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Subir CV</h4>
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
            <button className="btn btn-primary w-100 mt-3" onClick={handleUpload}>
              Subir
            </button>
            <button className="btn btn-secondary w-100 mt-2" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
            {message && <p className="text-danger mt-2">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
