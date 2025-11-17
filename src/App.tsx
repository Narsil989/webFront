import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header, Footer } from './components';
import EnterName from './pages/EnterName';
import PickDate from './pages/PickDate';
import Summary from './pages/Summary';
import { UserProvider } from './contexts/UserContext';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<EnterName />} />
          <Route path="/pick-date" element={<PickDate />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
};

export default App;