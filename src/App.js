import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Menu from './menu/Menu';
import Layout from './layout/Layout';
import GenericPage from './GenericPage';

import './App.css';

function App() {
  const routes = [
    { name: "Ethik", path: "/" },
    { name: "Starthilfe", path: "/starthilfe" },
    { name: "Ernährung", path: "/ernaerung" },
    { name: "Rezepte", path: "/rezepte" },
    { name: "Weitere Informationen", path: "/weitere-informationen" }
  ];  

  return (
    <Layout>
      <Router>
        <Menu routes={routes} />
        <Routes>
          {routes.map(category => (
            <Route
              key={category.name}
              path={category.path}
              element={<GenericPage category={category.name} />}
            />
          ))}
        </Routes>
      </Router>
    </Layout>
  );
}

export default App;
