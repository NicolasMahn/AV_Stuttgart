import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Menu from './menu/Menu';
import Layout from './layout/Layout';
import Ethik from './germanPages/Ethik';
import AufDerKarte from './germanPages/AufDerKarte';
import Starthilfe from './germanPages/Ernaerung';
import Rezepte from './germanPages/Rezepte';
import WeitereInformationen from './germanPages/WeitereInformationen';

import './App.css';
import Ernaerung from './germanPages/Ernaerung';

function App() {
  return (
    <Layout>
      <Router>
        <div className="App">
          <Menu/>
          <Routes>
            <Route path="/" element={<Ethik />} />
            <Route path="/auf-der-karte" element={<AufDerKarte />} />
            <Route path="/ernaerung" element={<Ernaerung />} />
            <Route path="/rezepte" element={<Rezepte />} />
            <Route path="/weitere-informationen" element={<WeitereInformationen />} />
          </Routes>
        </div>
      </Router>
    </Layout>
  );
}

export default App;
