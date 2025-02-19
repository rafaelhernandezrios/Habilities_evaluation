import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Register.css"; // Asegúrate de que la ruta sea correcta
import logo from "../assets/logo1.png"; // Imagen del logo

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    nationality: "",
    gender: "",
    institution: "",
    title: "",
    academic_level: "",
    research_area: "",
    student_id: "",
    semester: "",
    program: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[!@#$%^&*(),.?":{}|<>]/)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
      setPasswordMatch(value === form.confirmPassword);
    }
    if (name === 'confirmPassword') {
      setPasswordMatch(value === form.password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    
    if (!form.email.includes("@")) {
      setError("Por favor, introduce un email válido.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, form);
      setMessage("Usuario registrado con éxito. Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Error en el registro. Intenta de nuevo.");
    }
  };

  useEffect(() => {
    // Asegurarse de que Bootstrap está inicializado correctamente
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
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
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link px-3" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3" to="/login">Iniciar Sesión</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="register-container">
        <div className="register-card">
          <h2 className="register-title">Registro</h2>
          <form onSubmit={handleSubmit}>
            {/* Datos personales */}
            <h4 className="section-title">Datos Personales</h4>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Nombre Completo"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Correo Electrónico"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Contraseña (mínimo 6 caracteres)"
                onChange={handleChange}
                required
                minLength="6"
              />
              <div className="password-strength-meter mt-2">
                <div className="strength-bars">
                  <div className={`strength-bar ${passwordStrength >= 1 ? 'active' : ''}`}></div>
                  <div className={`strength-bar ${passwordStrength >= 2 ? 'active' : ''}`}></div>
                  <div className={`strength-bar ${passwordStrength >= 3 ? 'active' : ''}`}></div>
                  <div className={`strength-bar ${passwordStrength >= 4 ? 'active' : ''}`}></div>
                </div>
                <small className="strength-text">
                  {passwordStrength === 0 && "Muy débil"}
                  {passwordStrength === 1 && "Débil"}
                  {passwordStrength === 2 && "Media"}
                  {passwordStrength === 3 && "Fuerte"}
                  {passwordStrength === 4 && "Muy fuerte"}
                </small>
              </div>
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="confirmPassword"
                className={`form-control ${form.confirmPassword ? (passwordMatch ? 'is-valid' : 'is-invalid') : ''}`}
                placeholder="Confirmar contraseña (mínimo 6 caracteres)"
                onChange={handleChange}
                required
                minLength="6"
              />
              {form.confirmPassword && !passwordMatch && (
                <div className="invalid-feedback">
                  Las contraseñas no coinciden
                </div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="Teléfono"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                name="dob"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="nationality"
                className="form-control"
                placeholder="Nacionalidad"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <select
                name="gender"
                className="form-control"
                onChange={handleChange}
                required
              >
                <option value="">Selecciona tu género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Datos de la carrera/universidad */}
            <h4 className="section-title">Datos Universitarios</h4>
            <div className="mb-3">
              <input
                type="text"
                name="institution"
                className="form-control"
                placeholder="Institución"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Título Académico"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="research_area"
                className="form-control"
                placeholder="Área de Investigación"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <select
                name="academic_level"
                className="form-select"
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un grado académico</option>
                <option value="Secundaria">Secundaria</option>
                <option value="Media Superior">Media Superior</option>
                <option value="Superior">Superior</option>
              </select>
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="student_id"
                className="form-control"
                placeholder="Matrícula o ID Estudiantil"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="semester"
                className="form-control"
                placeholder="Semestre"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="program"
                className="form-control"
                placeholder="Programa o Carrera"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-register w-100">
              Registrarse
            </button>
          </form>
          {message && <p className="register-message">{message}</p>}

          <div className="register-footer">
            <p>
              ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
