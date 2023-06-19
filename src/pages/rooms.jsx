import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Community from './community';
import Study from './study';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Community />} />
        <Route path="/study" element={<Study />} />
      </Routes>
    </Router>
  );
}

export default App;
