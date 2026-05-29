import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
      
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;