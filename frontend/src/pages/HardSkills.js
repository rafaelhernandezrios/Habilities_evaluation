import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/HardSkills.css"; // Archivo de estilos personalizados

const HardSkills = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [questions, setQuestions] = useState([]);
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
        "http://localhost:5000/api/users/submit-hard-skills",
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
    <div className="hardskills-container">
      <h2 className="text-center hardskills-title">Cuestionario de Inteligencias Múltiples</h2>

      {/* Barra de Progreso */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${(currentStep / (steps - 1)) * 100}%` }}></div>
      </div>

      {/* Formulario */}
      <form className="hardskills-form" onSubmit={handleSubmit}>
        <div className="form-step">
          {questions.slice(currentStep * 5, (currentStep + 1) * 5).map((question, index) => (
            <div className="question" key={index + currentStep * 5}>
              <label>{question}</label>
              <div className="options">
                <label>
                  <input
                    type="radio"
                    name={`q${index + currentStep * 5}`}
                    value="1"
                    onChange={(e) => handleChange(e, index + currentStep * 5)}
                    required
                  />
                  Falso
                </label>
                <label>
                  <input
                    type="radio"
                    name={`q${index + currentStep * 5}`}
                    value="5"
                    onChange={(e) => handleChange(e, index + currentStep * 5)}
                  />
                  Verdadero
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

export default HardSkills;
