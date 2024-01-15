import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Menu from './menu/Menu';
import Layout from './layout/Layout';
import GenericPage from './GenericPage';

import './App.css';

function App() {
  const routes = [
    { name: "Ethik", yaml_name: "Ethik", path: "/" },
    { name: "Starthilfe", yaml_name: "Starthilfe", path: "/starthilfe" },
    { name: "Ernährung", yaml_name: "Ernaehrung", path: "/ernaerung" },
    { name: "Rezepte", yaml_name: "Rezepte", path: "/rezepte" },
    { name: "Weitere Informationen", yaml_name: "WeitereInformationen", path: "/weitere-informationen" }
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
              element={<GenericPage category={category.yaml_name} />}
            />
          ))}
        </Routes>
      </Router>
    </Layout>
  );
}

export default App;
