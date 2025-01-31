import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
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
        const response = await axios.get("https://habilities-evaluation.onrender.com/api/users/me", {
          headers: { Authorization: token },
        });
        setUser(response.data);
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
      await axios.post("https://habilities-evaluation.onrender.com/api/users/upload-cv", formData, {
        headers: { "Authorization": token, "Content-Type": "multipart/form-data" },
      });
      setMessage("CV subido con éxito.");
      setShowModal(false); // Cerrar modal al subir el archivo
      window.location.reload(); // Refrescar la página para mostrar cambios
    } catch (error) {
      setMessage("Error al subir el archivo.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-title">Dashboard</h2>

        {user ? (
          <div className="dashboard-info">
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            {/* Estado del CV */}
            <p><strong>CV:</strong> {user.cvPath ? "✅ Subido" : "❌ No subido"}</p>
            {!user.cvPath && (
              <button className="btn btn-warning w-100" onClick={() => setShowModal(true)}>
                Subir CV
              </button>
            )}

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
        ) : (
          <p className="text-muted">Cargando datos...</p>
        )}

        <div className="dashboard-buttons">
          <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} className="btn btn-danger w-100">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
