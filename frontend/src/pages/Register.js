import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Register.css"; // Importar los estilos personalizados

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    institution: "",
    title: "",
    research_area: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://habilities-evaluation.onrender.com/api/auth/register", form);
      setMessage("Usuario registrado con éxito. Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" name="name" className="form-control" placeholder="Nombre Completo" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="email" name="email" className="form-control" placeholder="Correo Electrónico" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="password" name="password" className="form-control" placeholder="Contraseña" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="text" name="institution" className="form-control" placeholder="Institución" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="text" name="title" className="form-control" placeholder="Título Académico" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="text" name="research_area" className="form-control" placeholder="Área de Investigación" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-register w-100">Registrarse</button>
        </form>
        {message && <p className="text-danger register-message">{message}</p>}

        <div className="register-footer">
          <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
