import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [cvPath, setCvPath] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCV = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Debes iniciar sesión para ver tu CV.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/users/cv", {
          headers: { Authorization: token },
        });
        setCvPath(response.data.filePath);
      } catch (error) {
        setMessage("No tienes un CV subido.");
      }
    };

    fetchCV();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {cvPath ? (
        <div>
          <p><strong>CV:</strong> Subido ✅</p>
          <a href={`http://localhost:5000${cvPath}`} target="_blank" rel="noopener noreferrer">
            <button>Ver CV</button>
          </a>
          <a href={`http://localhost:5000${cvPath}`} download>
            <button>Descargar CV</button>
          </a>
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default Dashboard;
