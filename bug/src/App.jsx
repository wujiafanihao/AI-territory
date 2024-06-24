import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/Home'; 
import HackNew from './components/HackNew';
import Query from './components/Query';
import AITool from './components/AI-tools';

const MachineLearning = () => <div>Machine Learning Page</div>;

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
      </Routes>
    </Router>
  );
};

export default App;
