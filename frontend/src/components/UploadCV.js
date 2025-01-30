import React, { useState } from "react";
import axios from "axios";

const UploadCV = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
  
    if (!file) {
      setMessage("Por favor, selecciona un archivo PDF.");
      return;
    }
  
    const token = localStorage.getItem("token");
    console.log("Token en frontend:", token); // 🔹 Verificar que el token se obtiene correctamente
  
    if (!token) {
      setMessage("Debes iniciar sesión para subir un CV.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post("http://localhost:5000/api/users/upload-cv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token.replace("Bearer ", "")}`, // 🔹 Asegurar que el token tiene el prefijo correcto
        },
      });
  
      setMessage("Archivo subido con éxito: " + response.data.filePath);
    } catch (error) {
      console.error("Error al subir el archivo:", error.response?.data || error);
      setMessage("Error al subir el archivo.");
    }
  };
  

  return (
    <div>
      <h2>Sube tu CV</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir CV</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadCV;
