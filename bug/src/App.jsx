//App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/Home'; 
import HackNew from './components/HackNew';
import Query from './components/Query';
import AITool from './components/AI-tools';
import Chat from './components/Chat';
import './App.css';

const MachineLearning = () => <div>制作中...........</div>;

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/ai-tool" element={<AITool />} />
        <Route path="/hack-new" element={<HackNew />} />
        <Route path="/query" element={<Query />} />
        <Route path="/machine-learning" element={<MachineLearning />} />
	<Route path="/conversation" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;
