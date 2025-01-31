import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SoftSkills from "./pages/SoftSkills";
import HardSkills from "./pages/HardSkills";
import Register from "./pages/Register";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/soft-skills" element={<SoftSkills />} />
        <Route path="/hard-skills" element={<HardSkills />} />
      </Routes>
    </Router>
  );
}

export default App;
