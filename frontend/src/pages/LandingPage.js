import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LandingPage.css"; // Archivo de estilos personalizados
import logo from "../assets/logo1.png"; // Imagen del logo
import background from "../assets/ipn3.jpeg"; // Imagen de fondo

const LandingPage = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-gray py-3 fixed-top">
        <div className="container-fluid">
          <img src={logo} alt="Logo Habilities" width="150" height="150" />
          <a className="navbar-brand h1 text_format" href="#" style={{ color: "#fff" }}>
            Plataforma Inteligente MIRAI para la Detección de Talento
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">Iniciar Sesión</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Registrarse</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Sección de Propósito */}
      <header className="hero-section" style={{ backgroundImage: `url(${background})` }}>
        <div className="container text-center text-white purpose-box">
          <h1 className="display-4">Evaluación y Orientación Académica con IA</h1>
          <p className="lead">Brindamos a estudiantes y graduados universitarios una herramienta de evaluación y orientación basada en análisis de habilidades, inteligencia artificial y compatibilidad con programas académicos.</p>
        </div>
      </header>

      {/* Sección de Objetivos */}
      <section className="container my-5">
        <h2 className="text-center mb-4">🔹 Objetivos Principales</h2>
        <div className="row text-center">
          <div className="col-md-6 col-lg-3 mb-4">
            <i className="bi bi-bar-chart-fill icon-feature"></i>
            <h4>Evaluar Habilidades</h4>
            <p>Encuestas personalizadas sobre inteligencias múltiples, habilidades blandas y duras para generar un perfil detallado del usuario.</p>
          </div>
          <div className="col-md-6 col-lg-3 mb-4">
            <i className="bi bi-file-earmark-text icon-feature"></i>
            <h4>Crear un CV con IA</h4>
            <p>Permite subir un CV y generar un análisis automático, asistiendo en la creación de un CV optimizado.</p>
          </div>
          <div className="col-md-6 col-lg-3 mb-4">
            <i className="bi bi-mortarboard icon-feature"></i>
            <h4>Match con Universidades</h4>
            <p>Conecta a los usuarios con universidades, maestrías y doctorados adecuados según su perfil.</p>
          </div>
          <div className="col-md-6 col-lg-3 mb-4">
            <i className="bi bi-globe icon-feature"></i>
            <h4>Plataforma Escalable</h4>
            <p>Integración con otras plataformas educativas y acceso a perfiles por instituciones.</p>
          </div>
        </div>
      </section>

      {/* Sección de CTA */}
      <div className="text-center my-5">
        <Link to="/register" className="btn btn-custom btn-lg">Regístrate Ahora</Link>
      </div>
    </div>
  );
};

export default LandingPage;
