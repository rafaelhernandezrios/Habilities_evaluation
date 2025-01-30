import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LandingPage.css"; // Archivo de estilos personalizados
import logo from "../assets/logo1.png"; // Imagen del logo
import background from "../assets/ipn2.jpeg"; // Imagen de fondo

const LandingPage = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-gray py-2">
        <div className="container-fluid">
          <img src={logo} alt="Logo Habilities" width="150" height="150" />
          <a className="navbar-brand h1 text_format" href="#" style={{ color: "#333" }}>
            Plataforma de Gestión y Evaluación de Habilidades
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link text_format" href="#" style={{ color: "#333" }}>Inicio</a></li>
              <li className="nav-item"><a className="nav-link text_format" href="#" style={{ color: "#333" }}>Servicios</a></li>
              <li className="nav-item"><a className="nav-link text_format" href="#" style={{ color: "#333" }}>Contacto</a></li>
            </ul>
          </div>
        </div>
      </nav>

        {/* Sección "¿Qué ofrecemos?" con Imagen de Fondo */}
        <section
        className="bg-cherry py-5 text-white text-center"
        style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
        }}
>
        {/* Fondo semitransparente */}
        <div className="overlay"></div>

        <div className="container content-box">
            <h2 className="mb-4 fw-bold">¿Qué ofrecemos?</h2>
            <div className="row">
            <div className="col-md-4">
                <div className="card shadow-lg custom-card">
                <div className="card-body">
                    <h5 className="card-title">Evaluaciones precisas</h5>
                    <p className="card-text">Recibe retroalimentación detallada sobre tus habilidades.</p>
                </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card shadow-lg custom-card">
                <div className="card-body">
                    <h5 className="card-title">Informes personalizados</h5>
                    <p className="card-text">Obtén recomendaciones para mejorar tus competencias.</p>
                </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card shadow-lg custom-card">
                <div className="card-body">
                    <h5 className="card-title">Plataforma intuitiva</h5>
                    <p className="card-text">Accede a nuestras herramientas de manera fácil y rápida.</p>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>



        {/* Sección de Inicio de Sesión con Mejor Diseño */}
        <section className="login-section text-center py-5">
        <div className="container">
            <h2 className="mb-3 fw-bold text-dark">Forma parte de nuestra comunidad</h2>
            <p className="text-muted mb-4">
            Explora nuevas oportunidades y desarrolla tus habilidades con nuestra plataforma.  
            </p>
            <Link to="/login" className="btn custom-btn btn-lg">
            <i className="bi bi-box-arrow-in-right"></i> Iniciar Sesión
            </Link>
        </div>
        </section>



      {/* Footer */}
      <footer className="bg-dark text-white text-center py-2">
        <p>© 2025 Mirai Innovation. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
