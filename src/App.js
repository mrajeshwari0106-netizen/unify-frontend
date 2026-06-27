import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Schemes from './pages/Schemes';
import Chat from './pages/Chat';
import Login from './pages/Login';
import './App.css';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <PrivateRoute>
              <Navbar />
              <div className="main-content">
                <Routes>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/schemes" element={<Schemes />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/" element={<Navigate to="/profile" />} />
                </Routes>
              </div>
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;