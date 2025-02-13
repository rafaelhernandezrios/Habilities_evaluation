// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SoftSkills from './pages/SoftSkills';
import HardSkills from './pages/HardSkills';
import AnalyzeCV from './pages/AnalyzeCV'; 
import PrivateRoute from './components/PrivateRoute';
import SoftSkillsResults from './pages/SoftSkillsResults';
import HardSkillsResults from './pages/HardSkillsResults';
import InterviewResults from './pages/InterviewResults';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/analyze-cv"
          element={
            <PrivateRoute>
              <AnalyzeCV />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/soft-skills"
          element={
            <PrivateRoute>
              <SoftSkills />
            </PrivateRoute>
          }
        />
        <Route
          path="/hard-skills"
          element={
            <PrivateRoute>
              <HardSkills />
            </PrivateRoute>
          }
         />
         <Route
          path="/interview-results"
          element={
            <PrivateRoute>
              <InterviewResults />
            </PrivateRoute>
          }
         />
         <Route
          path="/soft-skills-results"
          element={
            <PrivateRoute>
              <SoftSkillsResults />
            </PrivateRoute>
          }
         />
         <Route
          path="/hard-skills-results"
          element={
            <PrivateRoute>
              <HardSkillsResults />
            </PrivateRoute>
          }
         />
        </Routes>
    </Router>
  );
}

export default App;
