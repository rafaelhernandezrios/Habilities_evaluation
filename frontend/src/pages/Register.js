import React, { useState } from "react";
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
    phone: "",
    dob: "",
    nationality: "",
    gender: "",
    institution: "",
    title: "",
    research_area: "",
    student_id: "",
    semester: "",
    program: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      await axios.post(`http://14.10.2.192:20352/api/auth/register`, form);
      setMessage("Usuario registrado con éxito. Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Error en el registro. Intenta de nuevo.");
    }
  };

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
              placeholder="Contraseña"
              onChange={handleChange}
              required
            />
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
