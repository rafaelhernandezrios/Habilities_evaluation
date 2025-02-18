import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css"; // Importar los estilos personalizados
import { Link } from "react-router-dom";
import logo from "../assets/logo1.png"; // Imagen del logo

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, form);
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      setMessage("Inicio de sesión exitoso. Redirigiendo...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      setMessage(error.response.data.message);
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
            <Link className="nav-link" to="/">Inicio</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn btn-login w-100">Iniciar Sesión</button>
        </form>
        {message && <p className="text-danger login-message">{message}</p>}

        <div className="login-footer">
          <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
        </div>
      </div>
    </div>
    </div>

  );
};

export default Login;
