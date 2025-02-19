import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/HardSkills.css";
import logo from "../assets/logo1.png";

const HardSkills = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [questions, setQuestions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar preguntas del cuestionario de inteligencias múltiples
    setQuestions([
      "Si me preguntan cómo llegar a una ubicación, prefiero hacer un croquis que explicarlo verbalmente.",
      "Cuando me siento molesto(a) o feliz, sé exactamente el motivo.",
      "Canto, toco o alguna vez he tocado algún instrumento musical.",
      "La música me ayuda a identificar mis emociones.",
      "Tengo facilidad para hacer cálculos aritméticos de forma mental y con rapidez.",
      "Soy capaz de ayudar a mis compañeros(as) a manejar sus emociones, porque he vivido situaciones similares.",
      "Prefiero realizar operaciones matemáticas empleando la calculadora que mentalmente.",
      "Se me facilita aprender nuevos pasos de baile.",
      "Expreso lo que pienso con facilidad cuando platico con mis compañeros(as).",
      "Gozo cuando participo en una buena conversación.",
      "Tengo buen sentido de orientación espacial (norte, sur, este, oeste).",
      "Disfruto reunir a mis amigos(as) en fiestas y eventos.",
      "Necesito escuchar música para sentirme bien.",
      "Se me facilita entender instructivos y diagramas.",
      "Me gustan los juegos de destreza, crucigramas y videojuegos.",
      "Se me facilita aprender actividades físicas que requieren destreza como andar en patineta, bicicleta, etc.",
      "Me molesto cuando mis compañeros(as) dicen palabras sin sentido.",
      "Tengo capacidad de persuadir a mis compañeros(as) para que sigan mis ideas.",
      "Se me facilitan los bailes que requieren de coordinación y equilibrio.",
      "Soy hábil para identificar secuencias numéricas (1,2,4,8, __,32).",
      "Se me facilita realizar trabajos de construcción como maquetas, esculturas, etc.",
      "Tengo talento para identificar el significado de las palabras.",
      "Tengo facilidad de girar mentalmente un objeto.",
      "Hay canciones o música que me recuerdan acontecimientos importantes de mi vida.",
      "Me gusta trabajar con cálculos, números y figuras geométricas.",
      "Disfruto del silencio porque me permite meditar sobre cómo me siento.",
      "Mirar construcciones nuevas me da una sensación de bienestar.",
      "Cuando estoy relajado(a) me gusta cantar o tocar algún instrumento.",
      "Soy hábil en los deportes de rendimiento.",
      "Me gusta tomar nota en mis clases.",
      "Regularmente identifico las señales y expresiones de mi rostro.",
      "Al observar el rostro de mis compañeros(as), fácilmente identifico su estado de ánimo.",
      "Me resulta fácil identificar mis sentimientos y emociones.",
      "Reconozco fácilmente los estados de ánimo de mis compañeros(as).",
      "Me doy cuenta fácilmente de lo que piensan mis compañeros(as) de mí."
    ]);
  }, []);

  const steps = Math.ceil(questions.length / 5);

  const handleChange = (e, index) => {
    setResponses({ ...responses, [index]: e.target.value });
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const validateStep = () => {
    const start = currentStep * 5;
    const end = start + 5;
    for (let i = start; i < end; i++) {
      if (!responses[i]) {
        alert("Por favor, responde todas las preguntas antes de continuar.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/submit-hard-skills`,
        { responses },
        { headers: { Authorization: token } }
      );
  
      if (response.status === 200) {
        alert("Encuesta enviada con éxito");
        navigate("/dashboard"); // Redirige al Dashboard
      } else {
        alert("Hubo un problema al enviar la encuesta");
      }
    } catch (error) {
      console.error("Error al enviar la encuesta:", error);
      alert("Ocurrió un error. Intenta de nuevo.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-gray py-2 fixed-top">
        <div className="container">
          <div className="navbar-brand-container d-flex align-items-center">
            <img src={logo} alt="Logo Habilities" width="80" height="80" className="navbar-logo" />
            <a className="navbar-brand h1 text_format d-none d-lg-block" href="#" style={{ color: "#fff" }}>
              Plataforma Inteligente MIRAI
            </a>
            <a className="navbar-brand h1 text_format d-lg-none" href="#" style={{ color: "#fff" }}>
              MIRAI
            </a>
          </div>
          
          {/* Botón para mostrar/ocultar sidebar en móvil */}
          <button
            className="btn btn-link d-lg-none me-3"
            onClick={toggleSidebar}
            style={{ color: 'white' }}
          >
            <i className="bi bi-list fs-4"></i>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link px-3" to="/dashboard">
                  <i className="bi bi-house-door"></i> Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3" to="/profile">
                  <i className="bi bi-person"></i> Perfil
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link px-3" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Layout Principal */}
      <div className="dashboard-layout">
        {/* Overlay para cerrar el sidebar en móvil */}
        <div 
          className={`sidebar-overlay ${showSidebar ? 'show' : ''}`} 
          onClick={closeSidebar}
        ></div>

        {/* Sidebar con clase dinámica */}
        <div className={`dashboard-sidebar ${showSidebar ? 'show' : ''}`}>
          <div className="sidebar-header">
            <img src={logo} alt="Logo" className="sidebar-logo" />
            <h3>Inteligencias Múltiples</h3>
          </div>
          
          <div className="sidebar-menu">
            <div className="survey-progress">
              <div className="progress-info">
                <span>Progreso</span>
                <span>{currentStep + 1}/{steps}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentStep + 1) / steps) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <button 
            className="menu-item return-dashboard"
            onClick={() => {
              if(window.confirm('¿Estás seguro de que deseas volver al dashboard? Se perderán tus respuestas.')) {
                navigate('/dashboard');
              }
            }}
          >
            <i className="bi bi-arrow-left-circle"></i>
            Volver al Dashboard
          </button>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <div className="survey-container">
            <div className="survey-header">
              <h2>Evaluación de Inteligencias Múltiples</h2>
              <p className="survey-description">
                Esta evaluación nos ayudará a identificar tus tipos de inteligencia predominantes.
              </p>
            </div>

            <form className="survey-form" onSubmit={handleSubmit}>
              <div className="questions-group">
                {questions.slice(currentStep * 5, (currentStep + 1) * 5).map((question, index) => (
                  <div className="question-card" key={index + currentStep * 5}>
                    <div className="question-header">
                      <span className="question-number">Pregunta {index + 1 + currentStep * 5}</span>
                      <p className="question-text">{question}</p>
                    </div>
                    
                    <div className="options-grid">
                      {[
                        { value: "1", label: "Falso" },
                        { value: "5", label: "Verdadero" }
                      ].map((option) => (
                        <label 
                          key={option.value}
                          className={`option-card ${
                            responses[index + currentStep * 5] === option.value ? 'selected' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q${index + currentStep * 5}`}
                            value={option.value}
                            onChange={(e) => handleChange(e, index + currentStep * 5)}
                            required
                          />
                          <span className="option-text">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="navigation-controls">
                {currentStep > 0 && (
                  <button 
                    type="button" 
                    className="nav-button prev"
                    onClick={handlePrev}
                  >
                    <i className="bi bi-arrow-left"></i>
                    Anterior
                  </button>
                )}
                
                {currentStep < steps - 1 ? (
                  <button 
                    type="button" 
                    className="nav-button next"
                    onClick={handleNext}
                  >
                    Siguiente
                    <i className="bi bi-arrow-right"></i>
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="nav-button submit"
                  >
                    Finalizar
                    <i className="bi bi-check-circle"></i>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default HardSkills;
