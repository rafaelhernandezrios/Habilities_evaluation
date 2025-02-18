import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Dashboard.css";
import logo from "../assets/logo1.png"; // Importar el logo
import 'bootstrap-icons/font/bootstrap-icons.css'; // Asegúrate de tener esta importación

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState('overview');
  const [mainContent, setMainContent] = useState('overview');
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
        const userResponse = await axios.get("http://14.10.2.192:20352/api/users/me", {
          headers: { Authorization: token },
        });
        setUser(userResponse.data);

        // Obtener estado del usuario
        const statusResponse = await axios.get("http://14.10.2.192:20352/api/users/status", {
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
      await axios.post("http://14.10.2.192:20352/api/users/upload-cv", formData, {
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

  const calculateProgress = () => {
    if (!status) return 0;
    const total = 4; // Total number of tasks
    let completed = 0;
    if (status.cvUploaded) completed++;
    if (status.cvAnalyzed) completed++;
    if (status.softSkillsSurvey) completed++;
    if (status.hardSkillsSurvey) completed++;
    return (completed / total) * 100;
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    
    switch(section) {
      case 'cv':
        if (status?.cvUploaded) {
          navigate('/analyze-cv');
        } else {
          setShowModal(true);
        }
        break;
      
      case 'skills':
        // Mostrar menú de evaluaciones
        setMainContent('skills');
        break;
        
      default:
        setMainContent('overview');
        break;
    }
  };

  const renderSkillsContent = () => (
    <div className="skills-menu">
      <h3 className="mb-4">Evaluaciones Disponibles</h3>
      <div className="skills-grid">
        <div className="skill-card">
          <i className="bi bi-person-check icon-feature"></i>
          <h4>Habilidades Blandas</h4>
          <p>Evalúa tus habilidades interpersonales y sociales</p>
          {status?.softSkillsSurvey ? (
            <Link to="/soft-skills-results" className="btn btn-secondary">
              Ver Resultados
            </Link>
          ) : (
            <Link to="/soft-skills" className="btn btn-primary">
              Iniciar Evaluación
            </Link>
          )}
        </div>

        <div className="skill-card">
          <i className="bi bi-mortarboard icon-feature"></i>
          <h4>Inteligencias Múltiples</h4>
          <p>Descubre tus tipos de inteligencia predominantes</p>
          {status?.hardSkillsSurvey ? (
            <Link to="/hard-skills-results" className="btn btn-secondary">
              Ver Resultados
            </Link>
          ) : (
            <Link to="/hard-skills" className="btn btn-primary">
              Iniciar Evaluación
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfileCard = () => (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-info">
          <h3>{user?.name}</h3>
          <p className="profile-email">{user?.email}</p>
        </div>
      </div>
      <div className="profile-details">
        <div className="detail-item">
          <i className="bi bi-telephone"></i>
          <div className="detail-content">
            <span className="detail-label">Teléfono: </span>
            <span className="detail-value">{user?.phone || 'No especificado'}</span>
          </div>
        </div>
        
        <div className="detail-item">
          <i className="bi bi-building"></i>
          <div className="detail-content">
            <span className="detail-label">Institución: </span>
            <span className="detail-value">{user?.institution || 'No especificada'}</span>
          </div>
        </div>

        <div className="detail-item">
          <i className="bi bi-award"></i>
          <div className="detail-content">
            <span className="detail-label">Título: </span>
            <span className="detail-value">{user?.title || 'No especificado'}</span>
          </div>
        </div>

        <div className="detail-item">
          <i className="bi bi-mortarboard"></i>
          <div className="detail-content">
            <span className="detail-label">Nivel Académico: </span>
            <span className="detail-value">{user?.academic_level || 'No especificado'}</span>
          </div>
        </div>

        <div className="detail-item">
          <i className="bi bi-book"></i>
          <div className="detail-content">
            <span className="detail-label">Programa: </span>
            <span className="detail-value">{user?.program || 'No especificado'}</span>
          </div>
        </div>

        <div className="detail-item">
          <i className="bi bi-calendar3"></i>
          <div className="detail-content">
            <span className="detail-label">Semestre: </span>
            <span className="detail-value">{user?.semester || 'No especificado'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Navbar estilo LandingPage */}
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

      {/* Dashboard Layout */}
      <div className="dashboard-layout">
        {/* Side Menu */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <img src={logo} alt="Logo" className="sidebar-logo" />
            <h3>Panel de Control</h3>
          </div>
          
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => handleSectionChange('overview')}
            >
              <i className="bi bi-grid-1x2-fill"></i>
              Vista General
            </button>
            <button 
              className={`menu-item ${activeSection === 'cv' ? 'active' : ''}`}
              onClick={() => handleSectionChange('cv')}
            >
              <i className="bi bi-file-text-fill"></i>
              Gestión de CV
            </button>
            <button 
              className={`menu-item ${activeSection === 'skills' ? 'active' : ''}`}
              onClick={() => handleSectionChange('skills')}
            >
              <i className="bi bi-lightbulb-fill"></i>
              Evaluación de Habilidades
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {mainContent === 'skills' ? (
            renderSkillsContent()
          ) : (
            <>
              <div className="dashboard-header">
                <div className="header-welcome">
                  <h2>Bienvenido de nuevo, {user?.name}</h2>
                  <p>Aquí está el resumen de tu progreso</p>
                </div>
                <div className="progress-circle-container">
                  <div 
                    className="progress-circle" 
                    style={{ "--progress": `${calculateProgress() * 3.6}deg` }}
                  >
                    <div className="progress-circle-content">
                      <div className="progress-value">{Math.round(calculateProgress())}%</div>
                      <div className="progress-text">Completado</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-content">
                <div className="content-left">
                  {renderProfileCard()}
                </div>
                <div className="content-right">
                  <div className="dashboard-stats">
                    <div className={`stat-card ${status?.cvUploaded ? 'completed' : 'pending'}`}>
                      <i className="bi bi-file-earmark-check icon-feature"></i>
                      <div className="stat-info">
                        <h4>Estado del CV</h4>
                        <p>
                          <span className={`status-dot ${status?.cvUploaded ? 'completed' : 'pending'}`}></span>
                          {status?.cvUploaded ? 'Subido' : 'Pendiente'}
                        </p>
                        {!status?.cvUploaded && (
                          <button className="btn btn-primary mt-2" onClick={() => setShowModal(true)}>
                            <i className="bi bi-upload"></i> Subir CV
                          </button>
                        )}
                        {status?.cvUploaded && (
                          <div className="cv-actions mt-2">
                            <Link to="/view-cv" className="btn btn-primary">
                              <i className="bi bi-file-pdf"></i> Ver CV
                            </Link>
                            {!status?.cvAnalyzed && (
                              <Link to="/analyze-cv" className="btn btn-secondary ms-2">
                                <i className="bi bi-search"></i> Analizar CV
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className={`stat-card ${status?.cvAnalyzed ? 'completed' : 'pending'}`}>
                      <i className="bi bi-chat-dots icon-feature"></i>
                      <div className="stat-info">
                        <h4>Entrevista</h4>
                        <p>
                          <span className={`status-dot ${status?.cvAnalyzed ? 'completed' : 'pending'}`}></span>
                          {status?.cvAnalyzed ? 'Completada' : 'Pendiente'}
                        </p>
                        {status?.cvAnalyzed ? (
                          <Link to="/interview-results" className="btn btn-secondary mt-2">
                            <i className="bi bi-graph-up"></i> Ver Resultados
                          </Link>
                        ) : (
                          <span className="text-muted mt-2 d-block">Sube y analiza tu CV primero</span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`stat-card ${status?.softSkillsSurvey ? 'completed' : 'pending'}`}>
                      <i className="bi bi-person-check icon-feature"></i>
                      <div className="stat-info">
                        <h4>Habilidades Blandas</h4>
                        <p>
                          <span className={`status-dot ${status?.softSkillsSurvey ? 'completed' : 'pending'}`}></span>
                          {status?.softSkillsSurvey ? 'Completado' : 'Pendiente'}
                        </p>
                        {status?.softSkillsSurvey ? (
                          <Link to="/soft-skills-results" className="btn btn-secondary mt-2">
                            <i className="bi bi-graph-up"></i> Ver Resultados
                          </Link>
                        ) : (
                          <Link to="/soft-skills" className="btn btn-primary mt-2">
                            <i className="bi bi-pencil"></i> Realizar Evaluación
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    <div className={`stat-card ${status?.hardSkillsSurvey ? 'completed' : 'pending'}`}>
                      <i className="bi bi-mortarboard icon-feature"></i>
                      <div className="stat-info">
                        <h4>Inteligencias Múltiples</h4>
                        <p>
                          <span className={`status-dot ${status?.hardSkillsSurvey ? 'completed' : 'pending'}`}></span>
                          {status?.hardSkillsSurvey ? 'Completado' : 'Pendiente'}
                        </p>
                        {status?.hardSkillsSurvey ? (
                          <Link to="/hard-skills-results" className="btn btn-secondary mt-2">
                            <i className="bi bi-graph-up"></i> Ver Resultados
                          </Link>
                        ) : (
                          <Link to="/hard-skills" className="btn btn-primary mt-2">
                            <i className="bi bi-pencil"></i> Realizar Evaluación
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Upload CV</h4>
              <button className="close-button" onClick={() => setShowModal(false)}>
                ✖️
              </button>
            </div>
            <div className="modal-body">
              <div className="file-upload-container">
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={(e) => setFile(e.target.files[0])}
                  id="cv-upload"
                />
                <label htmlFor="cv-upload">
                  📤 Choose PDF File
                </label>
              </div>
              {file && <div className="selected-file">{file.name}</div>}
              {message && <p className="message">{message}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
