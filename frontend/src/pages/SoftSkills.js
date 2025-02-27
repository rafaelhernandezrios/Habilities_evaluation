import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/SoftSkills.css";
import logo from "../assets/logo1.png";

const SoftSkills = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [questions, setQuestions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/me`, {
          headers: { Authorization: token },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchUserData();
    // Todas las preguntas extraídas del documento
    setQuestions([
      "Ante la adversidad se me facilita analizar las situaciones.",
      "Me gusta resolver problemas.",
      "Adopto una actitud constructiva.",
      "Pierdo el control cuando los demás no hacen lo que quiero.",
      "Tomo buenas decisiones cuando estoy estresado(a).",
      "Se me facilita iniciar una conversación.",
      "Regularmente colaboro con las personas que necesitan ayuda.",
      "Expongo mis ideas de forma clara.",
      "He tenido problemas con la ley.",
      "Cuando me comprometo a realizar algo lo cumplo.",
      "Me gusta investigar e innovar nuevas soluciones.",
      "Me entusiasma la idea de emprender actividades nuevas.",
      "Me entusiasma crear cosas originales.",
      "Tengo facilidad para convencer a mis compañeros(as) de que mis ideas son mejores.",
      "Propongo estrategias al equipo para resolver dificultades.",
      "Me gusta participar en mis equipos de trabajo.",
      "Planifico con anticipación mis actividades.",
      "Me siento capaz de aprender cosas nuevas.",
      "Doy mi máximo esfuerzo.",
      "Cuando trabajo en equipo propongo nuevas ideas.",
      "Soy capaz de analizar diferentes propuestas antes de tomar una decisión.",
      "Me gusta investigar y obtener ideas para la resolución de problemas.",
      "Identifico oportunidades en situaciones complicadas que otros no aprecian.",
      "Cuando me enojo reacciono de forma violenta.",
      "En momentos de estrés me mantengo amable.",
      "Se me facilita interactuar con otras personas.",
      "Disfruto ayudar a mis compañeros(as) en clase.",
      "Comunico mis emociones de forma espontánea, sin dificultad.",
      "Respeto las normas y reglamentos de la escuela.",
      "Mis compañeros(as) me consideran una persona confiable y responsable.",
      "Me abro a nuevas ideas y experiencias.",
      "Cuando me propongo realizar algo no paro hasta conseguirlo.",
      "Planteo soluciones originales a los problemas que se me presentan.",
      "Hago cambiar de opinión a mis compañeros(as) con facilidad.",
      "Me gusta tomar la iniciativa para emprender nuevas acciones.",
      "Fomento la motivación de mis compañeros(as) creando un ambiente agradable de trabajo.",
      "Organizo mis actividades anticipadamente.",
      "Aplico fácilmente mis conocimientos en situaciones nuevas.",
      "Me gusta resolver problemas difíciles.",
      "Elaboro por iniciativa propia nuevas actividades y proyectos.",
      "Cuando se me presenta una dificultad soy capaz de analizar sus diferentes aspectos.",
      "Analizo las causas de los problemas detenidamente.",
      "Preveo los problemas y planteo soluciones de forma anticipada.",
      "Cuando me molesto alzo la voz.",
      "Cuando estoy presionado(a) me cuesta trabajo resolver problemas.",
      "Se me facilita hacer amigos(as).",
      "Me siento capaz de ayudar a mis compañeros(as) y al mismo tiempo realizar mis propias actividades.",
      "Cuando transmito una idea verifico que me hayan comprendido.",
      "Me gusta respetar las normas escolares.",
      "Mis profesores(as) consideran que soy una persona responsable.",
      "Soy una persona flexible que me adapto a las diferentes situaciones que se me presentan.",
      "Me gusta asumir riesgos cuando mis profesores(as) me piden realizar nuevas actividades.",
      "Manejo los materiales de forma creativa.",
      "Se me facilita convencer a las y los demás con argumentos sólidos.",
      "Me gusta ser líder.",
      "Me siento apreciado(a) cuando trabajo en equipo.",
      "Administro mi tiempo en función de prioridades.",
      "Aplico el conocimiento en situaciones nuevas.",
      "Alcanzo mis objetivos.",
      "Busco nuevas formas de hacer las cosas.",
      "Cuando tengo un problema puedo encontrar soluciones inmediatas.",
      "Cuando se me presenta un problema selecciono la información importante, invierto tiempo y esfuerzo hasta solucionarlo.",
      "Cuando trabajo en equipo, puedo anticipar los problemas y propongo soluciones.",
      "Digo cosas de las que después me arrepiento.",
      "Cuando se me presenta una crisis soy capaz de mantener la calma.",
      "Mis compañeros(as) opinan que soy sociable.",
      "Me gusta el trabajo colaborativo.",
      "Me es fácil comunicarme con mis compañeros(as).",
      "Mi conducta y actitud son transparentes.",
      "Me resulta fácil asumir las consecuencias de mis actos.",
      "Cumplo con mis actividades escolares, aunque me cueste trabajo.",
      "Aun cuando me cueste trabajo realizar alguna actividad, la concluyo.",
      "Utilizo mi creatividad para inventar cosas originales.",
      "Convenzo a mis compañeros(as) fácilmente de que tengo la razón.",
      "Mis compañeros(as) confían en mi opinión para tomar decisiones.",
      "Mis compañeros(as) se sienten a gusto trabajando conmigo.",
      "Soy una persona organizada.",
      "Aprendo de nuevas experiencias con facilidad.",
      "Trabajo por lograr la excelencia en todo lo que hago.",
      "Busco oportunidades de mejora sin que me lo sugieran.",
      "Me es fácil identificar las causas de una situación complicada.",
      "Tengo la costumbre de analizar las ventajas y desventajas de las posibles soluciones a un problema.",
      "Veo los problemas como oportunidades.",
      "Pierdo los estribos y me dan ganas de tirar y romper cosas cuando me molesto.",
      "Cuando estoy estresado(a) me cuesta trabajo conciliar el sueño.",
      "Con frecuencia hago amigos(as) en la escuela.",
      "Mis compañeros(as) consideran que soy una persona colaborativa.",
      "Me es fácil comunicarme con mis profesores(as).",
      "Realizo mis actos de forma correcta y adecuada.",
      "Me comprometo con mis compañeros(as) cuando trabajo en equipo.",
      "Me adapto a nuevas situaciones.",
      "Me esfuerzo para concluir las actividades y trabajos escolares.",
      "Con los materiales de que dispongo elaboro objetos creativos.",
      "Influyo en las ideas de mis compañeros(as).",
      "Cuando trabajo en equipo con frecuencia asumo el liderazgo.",
      "Acepto los acuerdos de mi equipo de trabajo.",
      "Organizo mis actividades antes de empezar un proyecto.",
      "Aprendo de mis equivocaciones.",
      "Cuando trabajo en equipo me gusta realizar las actividades más complejas.",
      "Planteo propuestas para la solución de problemas.",
      "Me es fácil identificar el origen de un problema.",
      "Me considero hábil para resolver problemas.",
      "Me gusta afrontar problemas.",
      "Me ha ocasionado problemas mi carácter impulsivo.",
      "En situaciones difíciles o estresantes logro controlar la calma.",
      "Cuando tengo que realizar un trabajo se me facilita hablar con compañeros(as) que no conozco.",
      "No tengo problema para colaborar con las y los demás.",
      "Cuando estoy conversando acostumbro a escuchar a las y los demás sin interrumpir.",
      "Actúo de forma correcta, de acuerdo con las normas morales.",
      "Cumplo con mis actividades académicas.",
      "Tengo facilidad para comenzar nuevos proyectos.",
      "Consigo lo que me propongo.",
      "Considero que soy creativo(a).",
      "Cuando realizo trabajo colaborativo puedo convencer a mi equipo para que apoye mi decisión.",
      "Soy capaz de dirigir y orientar a mis compañeros(as) aportando soluciones.",
      "Aprecio las opiniones de mis profesores(as) y compañeros(as).",
      "Planifico y organizo por escrito lo que tengo que hacer.",
      "Me gusta aprender cosas nuevas.",
      "Desarrollo constantemente mis habilidades.",
      "Disfruto proponer cosas nuevas.",
      "Con facilidad comprendo la naturaleza de un problema cuando se me presenta.",
      "Cuando mi profesor(a) me plantea un problema me resulta fácil encontrar la solución.",
      "Puedo anticiparme a los problemas y encontrar soluciones.",
      "Soy impaciente.",
      "Me paralizo cuando la situación es complicada.",
      "Me resulta importante convivir con otras personas.",
      "Ofrezco mi apoyo de forma voluntaria.",
      "Entiendo las ideas de las y los demás.",
      "Algunas veces mi conducta ha sido contraria a las normas de la institución.",
      "Me gusta cumplir con mis actividades académicas.",
      "Me entusiasmo cuando realizo actividades nuevas y diferentes.",
      "Me gusta desarrollar nuevos proyectos.",
      "Tengo facilidad para crear un gran número de ideas originales.",
      "Logro convencer a mis compañeros(as) para que acepten y sigan mis ideas.",
      "Motivo e inspiro confianza en mis compañeros(as).",
      "Soy solidario(a) cuando algún compañero(a) tiene problemas.",
      "Organizo mis ideas y planifico mis actividades.",
      "Me gusta aprender de las y los demás.",
      "Me esfuerzo por alcanzar el éxito.",
      "Me gusta ofrecer mi ayuda sin que me lo soliciten."
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
        `${process.env.REACT_APP_API_BASE_URL}/api/users/submit-soft-skills`,
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
            <h3>Habilidades Blandas</h3>
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
              <h2>Evaluación de Habilidades Blandas</h2>
              <p className="survey-description">
                Esta evaluación nos ayudará a entender mejor tus habilidades interpersonales y de comportamiento.
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
                        { value: "1", label: "Rara vez o nunca" },
                        { value: "2", label: "Pocas veces" },
                        { value: "3", label: "Algunas veces" },
                        { value: "4", label: "Muchas veces" },
                        { value: "5", label: "Muy frecuentemente o siempre" }
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

export default SoftSkills;
