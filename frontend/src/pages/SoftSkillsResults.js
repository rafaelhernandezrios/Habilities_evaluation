// src/pages/SoftSkillsResults.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/SoftSkillsResults.css";
import logo from "../assets/logo1.png";
import 'bootstrap-icons/font/bootstrap-icons.css';

const SoftSkillsResults = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/me`, {
          headers: { Authorization: token },
        });
        console.log("Datos recibidos:", response.data.softSkillsResults);
        setResults(response.data.softSkillsResults || {});
      } catch (error) {
        console.error("Error al obtener resultados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDownload = () => {
    if (!results) return;

    const content = `
      RESULTADOS DE HABILIDADES BLANDAS
      ================================

      ${Object.entries(results).map(([skill, data]) => `
      ${skill}
      Nivel: ${data.level}
      `).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resultados_Habilidades_Blandas_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Nivel muy bajo':
        return '#dc3545';
      case 'Nivel bajo':
        return '#ff9800';
      case 'Nivel medio':
        return '#ffc107';
      case 'Nivel alto':
        return '#4caf50';
      case 'Nivel muy alto':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getLevelText = (level) => {
    const percentage = (level / 5) * 100;
    if (percentage <= 40) return 'Nivel Bajo';
    if (percentage <= 60) return 'Nivel Medio';
    return 'Nivel Alto';
  };

  const skillDescriptions = {
    "Cognitiva": "Capacidad de análisis, resolución de problemas e iniciativa.",
    "Afectiva": "Capacidad de autodominio y manejo del estrés.",
    "Social": "Habilidades de socialización, contribución y comunicación verbal.",
    "Moral": "Principios morales y nivel de compromiso.",
    "Acometimiento": "Capacidad de adaptación, innovación e inventiva.",
    "Directriz": "Habilidades de convencimiento, liderazgo y trabajo colaborativo.",
    "Gestión": "Capacidad de programación, orden y didáctica.",
    "Alto potencial": "Orientación al éxito y empuje personal."
  };

  const renderSkillCard = (competency, data) => (
    <div key={competency} className="skill-card">
      <div className="skill-header">
        <h4>{competency}</h4>
      </div>
      <p className="skill-description">{skillDescriptions[competency]}</p>
      <div className="skill-details">
        <p>Nivel: {data.level}</p>
        <p>Puntaje: {data.score}</p>
      </div>
      {Object.entries(data.skills || {}).map(([skill, skillData]) => (
        <div key={skill} className="sub-skill">
          <span>{skill}:</span>
          <span>{skillData.score} puntos</span>
        </div>
      ))}
    </div>
  );

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

    if (!results) {
      return (
        <div className="error-container">
          <i className="bi bi-exclamation-circle"></i>
          <p>No se encontraron resultados.</p>
        </div>
      );
    }

    switch (activeSection) {
      case 'details':
        return (
          <div className="results-section">
            <h3>
              <i className="bi bi-list-check"></i>
              Habilidades Blandas
            </h3>
            <div className="level-legend">
              <div className="legend-item">
                <span className="color-box" style={{ backgroundColor: '#dc3545' }}></span>
                <span>Nivel muy bajo</span>
              </div>
              <div className="legend-item">
                <span className="color-box" style={{ backgroundColor: '#ff9800' }}></span>
                <span>Nivel bajo</span>
              </div>
              <div className="legend-item">
                <span className="color-box" style={{ backgroundColor: '#ffc107' }}></span>
                <span>Nivel medio</span>
              </div>
              <div className="legend-item">
                <span className="color-box" style={{ backgroundColor: '#4caf50' }}></span>
                <span>Nivel alto</span>
              </div>
              <div className="legend-item">
                <span className="color-box" style={{ backgroundColor: '#28a745' }}></span>
                <span>Nivel muy alto</span>
              </div>
            </div>
            <div className="skills-grid">
              {Object.entries(results).map(([skill, data]) => renderSkillCard(skill, data))}
            </div>
          </div>
        );
      case 'overview':
      default:
        return (
          <div className="results-content">
            <div className="skills-summary">
              <h3>
                <i className="bi bi-graph-up"></i>
                Resumen de Habilidades
              </h3>
              <div className="skills-chart">
                {Object.entries(results).map(([skill, data]) => (
                  <div key={skill} className="chart-bar">
                    <div className="bar-label">
                      <span>{skill}</span>
                    </div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ 
                          width: `${(data.level / 5) * 100}%`,
                          backgroundColor: getLevelColor(data.level)
                        }}
                      >
                        {data.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="results-actions">
              <button className="btn btn-primary" onClick={handleDownload}>
                <i className="bi bi-download"></i> Descargar Resultados
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-gray py-3 fixed-top">
        <div className="container-fluid">
          <img src={logo} alt="Logo Habilities" width="150" height="150" />
          <Link className="navbar-brand h1 text_format" to="/dashboard" style={{ color: "#fff" }}>
            Plataforma Inteligente MIRAI
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
            <h3>Habilidades Blandas</h3>
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
              className={`menu-item ${activeSection === 'details' ? 'active' : ''}`}
              onClick={() => setActiveSection('details')}
            >
              <i className="bi bi-list-check"></i>
              Detalles
            </button>

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
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default SoftSkillsResults;
