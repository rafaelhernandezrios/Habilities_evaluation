import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/SoftSkills.css";

const SoftSkills = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
      "Me gusta respetar las normas escolares."
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
        "http://44.226.145.213:20352/api/users/submit-soft-skills",
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
  

  return (
    <div className="softskills-container">
      <h2 className="text-center softskills-title">Encuesta de Habilidades Blandas</h2>

      {/* Barra de Progreso */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${(currentStep / (steps - 1)) * 100}%` }}></div>
      </div>

      {/* Formulario */}
      <form className="softskills-form" onSubmit={handleSubmit}>
        <div className="form-step">
          {questions.slice(currentStep * 5, (currentStep + 1) * 5).map((question, index) => (
            <div className="question" key={index + currentStep * 5}>
              <label>{question}</label>
              <div className="options">
                <label>
                  <input type="radio" name={`q${index + currentStep * 5}`} value="1" onChange={(e) => handleChange(e, index + currentStep * 5)} required />
                  Rara vez o nunca
                </label>
                <label>
                  <input type="radio" name={`q${index + currentStep * 5}`} value="2" onChange={(e) => handleChange(e, index + currentStep * 5)} />
                  Pocas veces
                </label>
                <label>
                  <input type="radio" name={`q${index + currentStep * 5}`} value="3" onChange={(e) => handleChange(e, index + currentStep * 5)} />
                  Algunas veces
                </label>
                <label>
                  <input type="radio" name={`q${index + currentStep * 5}`} value="4" onChange={(e) => handleChange(e, index + currentStep * 5)} />
                  Muchas veces
                </label>
                <label>
                  <input type="radio" name={`q${index + currentStep * 5}`} value="5" onChange={(e) => handleChange(e, index + currentStep * 5)} />
                  Muy frecuentemente o siempre
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Botones de Navegación */}
        <div className="navigation-buttons">
          {currentStep > 0 && <button type="button" className="btn btn-secondary" onClick={handlePrev}>Anterior</button>}
          {currentStep < steps - 1 && <button type="button" className="btn btn-primary" onClick={handleNext}>Siguiente</button>}
          {currentStep === steps - 1 && <button type="submit" className="btn btn-success">Enviar Respuestas</button>}
        </div>
      </form>
    </div>
  );
};

export default SoftSkills;
