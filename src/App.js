import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
  const [language, setLanguage] = useState('de');

  const toggleLanguage = () => {
    setLanguage(prevLanguage => prevLanguage === 'de' ? 'en' : 'de');
  };

  const fileNameDE = "/content_de.yaml"
  const routesDE = [
    { name: "Ethik", path: "/" },
    { name: "Starthilfe", path: "/starthilfe" },
    { name: "Ernährung", path: "/ernaehrung" },
    { name: "Rezepte", path: "/rezepte" },
    { name: "Weitere Informationen", path: "/weitere-informationen" }
  ];  

  const fileNameEN = "/content_en.yaml"
  const routesEN = [
    { name: "Ethics", path: "/en/" },
    { name: "How to go vegan", path: "/en/how-to-go-vegan" },
    { name: "Nutrition", path: "/en/nutrition" },
    { name: "Recipes", path: "/en/recipes" },
    { name: "More Information", path: "/en/more-information" }
  ];

  const currentRoutes = language === 'de' ? routesDE : routesEN;
  const currentFileName = language === 'de' ? fileNameDE : fileNameEN;

  return (
    <Router>
      <TabProvider>
        <Layout>
        <Menu routes={currentRoutes} language={language} toggleLanguage={toggleLanguage} />
          <Routes>
            {currentRoutes.map(category => (
              <Route
                key={category.name}
                path={category.path}
                element={<GenericPage category={category.name} fileName={currentFileName}/>}
              />
            ))}
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/spenden" element={<Spenden />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/karte" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </TabProvider>
    </Router>
  );
}

export default App;