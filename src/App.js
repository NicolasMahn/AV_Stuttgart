import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Menu from './menu/Menu';
import Layout from './layout/Layout';
import GenericPage from './GenericPage'

import './App.css';

function App() {
  const Ethik = () => {
    return <GenericPage category="Ethik" />;
  };

  const Starthilfe = () => {
    return <GenericPage category="Starthilfe" />;
  };

  const Ernaerung = () => {
    return <GenericPage category="Ernaerung" />;
  };

  const Rezepte = () => {
    return <GenericPage category="Rezepte" />;
  };

  const WeitereInformationen = () => {
    return <GenericPage category="WeitereInformationen" />;
  };

  return (
    <Layout>
      <Router>
          <Menu/>
          <Routes>
            <Route path="/" element={<Ethik />} />
            <Route path="/starthilfe" element={<Starthilfe />} />
            <Route path="/ernaerung" element={<Ernaerung />} />
            <Route path="/rezepte" element={<Rezepte />} />
            <Route path="/weitere-informationen" element={<WeitereInformationen />} />
          </Routes>
      </Router>
    </Layout>
  );
}

export default App;
