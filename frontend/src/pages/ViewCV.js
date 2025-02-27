import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ViewCV.css';
import logo from '../assets/logo1.png';

const ViewCV = () => {
  const [cvUrl, setCvUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/view-cv`,
          {
            headers: { Authorization: token },
          }
        );
        setCvUrl(response.data.cvUrl);
      } catch (error) {
        console.error('Error al obtener el CV:', error);
        setError('No se pudo obtener el CV');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, []);

  const handleDownloadCV = () => {
    if (cvUrl) {
      window.open(cvUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="cv-viewer-container">
        <div className="loading-screen">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando información del CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-viewer-container">
      {/* Header */}
      <nav className="cv-viewer-header">
        <div className="header-content">
          <div className="header-left">
            <img src={logo} alt="Logo" className="header-logo" />
            <h2>Documento CV</h2>
          </div>
          <div className="header-right">
            <button onClick={() => navigate('/dashboard')} className="back-button">
              <i className="bi bi-arrow-left"></i> Volver al Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="cv-content">
        {error ? (
          <div className="message-container error-container">
            <i className="bi bi-exclamation-circle-fill"></i>
            <h3>Error al obtener el CV</h3>
            <p>{error}</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Volver al Dashboard
            </button>
          </div>
        ) : cvUrl ? (
          <div className="cv-card">
            <div className="cv-info">
              <i className="bi bi-file-earmark-pdf-fill document-icon"></i>
              <h3>Tu CV está listo para descargar</h3>
              <p>Haz clic en el botón para ver o descargar tu CV en formato PDF</p>
              <div className="cv-actions">
                <button onClick={handleDownloadCV} className="btn btn-primary download-btn">
                  <i className="bi bi-download"></i> Ver/Descargar CV
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="message-container no-cv-container">
            <i className="bi bi-file-earmark-x-fill"></i>
            <h3>No se encontró ningún CV</h3>
            <p>Por favor, sube tu CV desde el Dashboard</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Ir al Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCV; 