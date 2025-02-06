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
    // Cargar preguntas desde la API o una fuente de datos (por ahora estática)
    setQuestions([
      "Me estresa exponer mis ideas frente al grupo en el aula.",
      "Disfruto conversar con otras personas.",
      "Busco la manera de apoyar y ayudar a mis compañeros(as).",
      "Se me facilita comprender las ideas y las necesidades de mis compañeros(as).",
      "Trato de conducirme de forma correcta.",
      "Cuando entrego mis trabajos escolares soy puntual.",
      "Me siento mal cuando de un momento a otro cambian las cosas.",
      "Soy capaz de plantear proyectos y llevarlos a cabo.",
      "Mis compañeros(as) consideran que mis ideas son creativas.",
      "Puedo hacer que la gente se ponga de mi parte con facilidad."
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
        "http://localhost:5000/api/surveys/soft-skills",
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
