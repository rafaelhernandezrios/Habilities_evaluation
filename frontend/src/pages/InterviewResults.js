import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/InterviewResults.css";
import logo from "../assets/logo1.png";
import 'bootstrap-icons/font/bootstrap-icons.css';

const InterviewResults = () => {
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState('questions');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/interview-responses`, {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDownload = () => {
    if (!interviewData) return;

    // Crear el contenido del PDF
    const content = `
      RESULTADOS DE LA ENTREVISTA
      ==========================

      PUNTAJE TOTAL: ${interviewData.score}/100
      ----------------------------------------

      ANÁLISIS DETALLADO
      -----------------
      ${interviewData.analysis.map((item, index) => `
      Criterio ${index + 1}
      Puntaje: ${item.score}
      ${item.explanation}
      `).join('\n')}

      PREGUNTAS Y RESPUESTAS
      ---------------------
      ${interviewData.questions.map((question, index) => `
      Pregunta ${index + 1}: ${question}
      Respuesta: ${interviewData.responses[index]}
      `).join('\n')}
    `;

    // Crear un blob con el contenido
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    // Crear un enlace temporal y hacer clic en él
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resultados_Entrevista_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando resultados...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <i className="bi bi-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      );
    }

    if (!interviewData) return null;

    switch (activeSection) {
      case 'questions':
        return (
          <div className="results-section">
            <h3>
              <i className="bi bi-chat-dots"></i>
              Preguntas y Respuestas
            </h3>
            <div className="qa-list">
              {interviewData.questions.map((question, index) => (
                <div key={index} className="qa-card">
                  <div className="question">
                    <span className="q-number">P{index + 1}</span>
                    <p>{question}</p>
                  </div>
                  <div className="answer">
                    <h5>Tu Respuesta:</h5>
                    <p>{interviewData.responses[index]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div className="results-section">
            <h3>
              <i className="bi bi-graph-up"></i>
              Análisis Detallado
            </h3>
            <div className="analysis-grid">
              {interviewData.analysis.map((item, index) => (
                <div key={index} className="analysis-card">
                  <div className="analysis-header">
                    <div className="score-badge" style={{ 
                      backgroundColor: `hsl(${item.score * 1.2}, 70%, 50%)`
                    }}>
                      {item.score}
                    </div>
                    <h4>Criterio {index + 1}</h4>
                  </div>
                  <p>{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-gray py-3 fixed-top">
        <div className="container-fluid">
          <img src={logo} alt="Logo Habilities" width="150" height="150" />
          <Link className="navbar-brand h1 text_format" to="/dashboard" style={{ color: "#fff" }}>
            Plataforma Inteligente MIRAI para la Detección de Talento
          </Link>
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  <i className="bi bi-person-circle"></i> Perfil
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/resources">
                  <i className="bi bi-book"></i> Recursos
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn btn-link">
                  <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <img src={logo} alt="Logo" className="sidebar-logo" />
            <h3>Resultados</h3>
          </div>
          
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <i className="bi bi-speedometer2"></i>
              Resumen
            </button>
            <button 
              className={`menu-item ${activeSection === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveSection('questions')}
            >
              <i className="bi bi-chat-dots"></i>
              Preguntas
            </button>
            <button 
              className={`menu-item ${activeSection === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveSection('analysis')}
            >
              <i className="bi bi-graph-up"></i>
              Análisis
            </button>

            {/* Botón de regreso al dashboard */}
            <button 
              className="menu-item return-dashboard"
              onClick={() => navigate('/dashboard')}
            >
              <i className="bi bi-arrow-left-circle"></i>
              Volver al Dashboard
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {activeSection === 'overview' ? (
            <div className="results-content">
              <div className="score-card">
                <div className="score-circle" style={{ '--score': `${interviewData?.score || 0}%` }}>
                  <div className="score-value">
                    <h3>{interviewData?.score || 0}</h3>
                    <p>Puntos</p>
                  </div>
                </div>
                <div className="score-label">
                  <h4>Puntaje Total</h4>
                  <p>Basado en tus respuestas y análisis de IA</p>
                </div>
              </div>

              <div className="overview-analysis">
                <h3>
                  <i className="bi bi-graph-up"></i>
                  Resumen del Análisis
                </h3>
                <div className="analysis-grid">
                  {interviewData?.analysis.map((item, index) => (
                    <div key={index} className="analysis-card">
                      <div className="analysis-header">
                        <div className="score-badge" style={{ 
                          backgroundColor: `hsl(${item.score * 1.2}, 70%, 50%)`
                        }}>
                          {item.score}
                        </div>
                        <h4>Criterio {index + 1}</h4>
                      </div>
                      <p>{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="results-actions">
                <button className="btn btn-primary" onClick={handleDownload}>
                  <i className="bi bi-download"></i> Descargar Resultados Completos
                </button>
                <button className="btn btn-outline-primary" onClick={() => navigate("/dashboard")}>
                  Volver al Dashboard
                </button>
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </>
  );
};

export default InterviewResults;
