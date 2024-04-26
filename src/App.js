import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Menu from './menu/Menu';
import Layout from './layout/Layout';
import GenericPage from './GenericPage';

import Datenschutz from './Datenschutz';
import Impressum from './Impressum';
import Spenden from './Spenden';
import Kontakt from './Kontakt';

import './App.css';
import { TabProvider } from './menu/TabContext';

function App() {
  const routes = [
    { name: "Ethik", path: "/" },
    { name: "Starthilfe", path: "/starthilfe" },
    { name: "Ernährung", path: "/ernaerung" },
    { name: "Rezepte", path: "/rezepte" },
    { name: "Weitere Informationen", path: "/weitere-informationen" }
  ];  

  return (
    <Router>
      <TabProvider>
        <Layout>
          <Menu routes={routes} />
          <Routes>
            {routes.map(category => (
              <Route
                key={category.name}
                path={category.path}
                element={<GenericPage category={category.name} />}
              />
            ))}
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/spenden" element={<Spenden />} />
            <Route path="/kontakt" element={<Kontakt />} />
          </Routes>
        </Layout>
      </TabProvider>
    </Router>
  );
}

export default App;

// How to start app localy (for tests):
// npx create-react-app my-app
// npm start
// (page should open on its own, otherwise: http://localhost:3000/)