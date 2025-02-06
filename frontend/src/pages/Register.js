import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Register.css"; // Asegúrate de que la ruta sea correcta

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage("Usuario registrado con éxito. Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error en el registro");
    }
  };

  return (
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
  );
};

export default Register;
