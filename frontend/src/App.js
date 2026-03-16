import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SettlementPage from './pages/SettlementPage';
import JoinPage from './pages/JoinPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>💰 정산 시스템</h1>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settlement/:uuid" element={<SettlementPage />} />
          <Route path="/settlement/join/:uuid" element={<JoinPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
