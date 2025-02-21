import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/AnalyzeCV.css"; // Asegúrate de tener este archivo para los estilos
import "../styles/Loading.css"; // Nuevo archivo de estilos para el loading
import logo from "../assets/logo1.png";

const AnalyzeCV = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Estado para animación del avatar
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const questionRef = React.useRef(null); // Agregar esta referencia

  useEffect(() => {
    const analyzeCV = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/analyze-cv`,
          {},
          { headers: { Authorization: token } }
        );

        const { questions } = response.data;
        setQuestions(questions || []);
        setAnswers(new Array(questions.length).fill("")); 

        if (questions.length > 0) {
          speakQuestion(questions[0]); 
        }
      } catch (error) {
        console.error("Error analizando el CV:", error);
      } finally {
        setLoading(false);
      }
    };

    analyzeCV();
  }, []);

  // 🔊 Hablar y animar avatar
  const speakQuestion = (question) => {
    if ("speechSynthesis" in window) {
      // Cancelar cualquier audio previo
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(question);
      utterance.lang = "es-US";

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsAudioPlaying(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsAudioPlaying(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsAudioPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Tu navegador no soporta Web Speech API");
    }
  };

  const handleAnswerChange = (event) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1 && !isAudioPlaying) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      speakQuestion(questions[nextIndex]);
      
      // Scroll suave hacia la pregunta con offset
      setTimeout(() => {
        if (questionRef.current) {
          const navbarHeight = 100; // Altura aproximada del navbar
          const elementPosition = questionRef.current.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100); // Pequeño delay para asegurar que el DOM se ha actualizado
    } else if (!isAudioPlaying) {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0 && !isAudioPlaying) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      speakQuestion(questions[prevIndex]);
    }
  };

  const handleBackToDashboard = () => {
    // Detener cualquier audio en reproducción
    window.speechSynthesis.cancel();
    if (window.confirm('¿Estás seguro de que deseas volver al dashboard? Se perderán tus respuestas.')) {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/submit-interview`,
        { answers },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSubmitted(true);
        setTimeout(() => navigate("/interview-results"), 2000); 
      }
    } catch (error) {
      console.error("Error al enviar respuestas:", error);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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

      {/* Dashboard Layout */}
      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <img src={logo} alt="Logo" className="sidebar-logo" />
            <h3>Entrevista IA</h3>
          </div>
          
          <div className="sidebar-menu">
            <div className="interview-progress">
              <div className="progress-info">
                <span>Progreso</span>
                <span>{currentQuestionIndex + 1}/{questions.length}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <button 
            className="menu-item return-dashboard"
            onClick={handleBackToDashboard}
          >
            <i className="bi bi-arrow-left-circle"></i>
            Volver al Dashboard
          </button>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {loading ? (
            <div className="loading-container">
              <div className="loading-animation">
                <div className="loading-circle"></div>
                <div className="loading-circle"></div>
                <div className="loading-circle"></div>
              </div>
              <p className="loading-text">Analizando tu CV...</p>
            </div>
          ) : submitted ? (
            <div className="success-container">
              <div className="success-animation">
                <i className="bi bi-check-circle"></i>
              </div>
              <p>Respuestas enviadas con éxito</p>
              <p className="redirect-text">Redirigiendo a resultados...</p>
            </div>
          ) : (
            <div className="interview-container">
              <div className="ai-assistant">
                <div className={`ai-avatar ${isSpeaking ? "speaking" : ""}`}>
                  <div className="avatar-rings">
                    <div className="ring"></div>
                    <div className="ring"></div>
                    <div className="ring"></div>
                  </div>
                  <div className="avatar-core" />
                </div>
                {isSpeaking && (
                  <div className="sound-waves">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                  </div>
                )}
              </div>

              {questions.length > 0 ? (
                <div className="question-section" ref={questionRef}>
                  <div className="question-card">
                    <span className="question-number">Pregunta {currentQuestionIndex + 1}</span>
                    <p className="question-text">{questions[currentQuestionIndex]}</p>
                    <div className="answer-section">
                      <textarea
                        className="answer-input"
                        value={answers[currentQuestionIndex] || ""}
                        onChange={handleAnswerChange}
                        placeholder="Escribe tu respuesta aquí..."
                        rows="4"
                      />
                    </div>
                  </div>

                  <div className="navigation-controls">
                    <button 
                      onClick={handlePreviousQuestion} 
                      className="nav-button prev"
                      disabled={currentQuestionIndex === 0 || isAudioPlaying}
                    >
                      <i className="bi bi-arrow-left"></i>
                      Anterior
                    </button>

                    <button 
                      onClick={handleNextQuestion} 
                      className="nav-button next"
                      disabled={isAudioPlaying}
                    >
                      {isAudioPlaying ? (
                        <i className="bi bi-hourglass-split"></i>
                      ) : currentQuestionIndex < questions.length - 1 ? (
                        <>Siguiente <i className="bi bi-arrow-right"></i></>
                      ) : (
                        <>Finalizar <i className="bi bi-check-circle"></i></>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-questions">
                  <i className="bi bi-exclamation-circle"></i>
                  <p>No se encontraron preguntas para la entrevista.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AnalyzeCV;
