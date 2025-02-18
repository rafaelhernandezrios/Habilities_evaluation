// src/pages/HardSkillsResults.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/HardSkillsResults.css";
import logo from "../assets/logo1.png";
import 'bootstrap-icons/font/bootstrap-icons.css';

const HardSkillsResults = () => {
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
        setResults(response.data.hardSkillsResults || {});
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
      RESULTADOS DE INTELIGENCIAS MÚLTIPLES
      ====================================

      ${Object.entries(results).map(([skill, data]) => `
      ${skill}
      Nivel: ${data.level}
      `).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resultados_Inteligencias_Multiples_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getLevelColor = (level) => {
    if (level <= 2) return '#dc3545'; // Rojo para nivel bajo
    if (level <= 3) return '#ffc107'; // Amarillo para nivel medio
    return '#28a745'; // Verde para nivel alto
  };

  const getLevelText = (level) => {
    if (level <= 2) return 'Nivel Bajo';
    if (level <= 3) return 'Nivel Medio';
    return 'Nivel Alto';
  };

  const intelligenceDescriptions = {
    'Lingüística': 'Capacidad para usar las palabras de manera efectiva, sea de manera oral o escrita. Incluye la habilidad en el uso de la sintaxis, la fonética, la semántica y los usos pragmáticos del lenguaje.',
    'Lógico-Matemática': 'Capacidad para usar los números de manera efectiva y de razonar adecuadamente. Incluye la sensibilidad a los esquemas y relaciones lógicas, las afirmaciones y las proposiciones.',
    'Espacial': 'Capacidad de pensar en tres dimensiones. Permite percibir imágenes externas e internas, recrearlas, transformarlas o modificarlas, recorrer el espacio o hacer que los objetos lo recorran.',
    'Musical': 'Capacidad de percibir, discriminar, transformar y expresar las formas musicales. Incluye la sensibilidad al ritmo, al tono y al timbre.',
    'Corporal-Kinestésica': 'Capacidad para usar todo el cuerpo en la expresión de ideas y sentimientos, y la facilidad en el uso de las manos para transformar elementos.',
    'Interpersonal': 'Capacidad de entender a los demás e interactuar eficazmente con ellos. Incluye la sensibilidad a expresiones faciales, la voz, los gestos y posturas.',
    'Intrapersonal': 'Capacidad de construir una percepción precisa respecto de sí mismo y de organizar y dirigir su propia vida.',
    'Naturalista': 'Capacidad de distinguir, clasificar y utilizar elementos del medio ambiente, objetos, animales o plantas.'
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
              Tipos de Inteligencias
            </h3>
            <div className="intelligence-grid">
              {Object.entries(results).map(([skill, data]) => (
                <div key={skill} className="intelligence-card">
                  <div className="intelligence-header">
                    <h4>{skill}</h4>
                    <div className="level-indicator" style={{ color: getLevelColor(data.level) }}>
                      {getLevelText(data.level)}
                    </div>
                  </div>
                  <p className="intelligence-description">{intelligenceDescriptions[skill]}</p>
                  <div className="level-bar">
                    <div 
                      className="level-fill"
                      style={{ 
                        width: `${(data.level / 5) * 100}%`,
                        backgroundColor: getLevelColor(data.level)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="level-legend">
              <div className="legend-item">
                <span className="color-box" style={{ backgroundColor: '#dc3545' }}></span>
                <span>Nivel Bajo (1-2)</span>
              </div>
              <div className="legend-item">
                <span className="color-box" style={{ backgroundColor: '#ffc107' }}></span>
                <span>Nivel Medio (3)</span>
              </div>
              <div className="legend-item">
                <span className="color-box" style={{ backgroundColor: '#28a745' }}></span>
                <span>Nivel Alto (4-5)</span>
              </div>
            </div>
          </div>
        );
      case 'overview':
      default:
        return (
          <div className="results-content">
            <div className="intelligence-summary">
              <h3>
                <i className="bi bi-graph-up"></i>
                Resumen de Inteligencias
              </h3>
              <div className="intelligence-chart">
                {Object.entries(results).map(([skill, data]) => (
                  <div key={skill} className="chart-bar">
                    <div className="bar-label">
                      <span>{skill}</span>
                      <span className="level-text" style={{ color: getLevelColor(data.level) }}>
                        {getLevelText(data.level)}
                      </span>
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
            <h3>Inteligencias Múltiples</h3>
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
          {renderContent()}
        </div>
      </div>
    </>
  );
};
export default HardSkillsResults;
