import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import yaml from 'js-yaml';

import Menu from './menu/Menu';
import Layout from './layout/Layout';
import ScrollContainer from './ScrollContainer';

import Datenschutz from './Datenschutz';
import Impressum from './Impressum';
import Spenden from './Spenden';
import Kontakt from './Kontakt';

import './App.css';
import { TabProvider } from './menu/TabContext';

// Utility function to normalize hash names (replace spaces with underscores)
const normalizeHash = (hash) => {
  return hash.replace(/\s+/g, '_');
};

function AppContent({ language, setLanguage }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [routesDE, setRoutesDE] = useState([]);
  const [routesEN, setRoutesEN] = useState([]);
  const [loading, setLoading] = useState(true);

  const fileNameDE = "/content_de.yaml"
  const fileNameEN = "/content_en.yaml"

  // Preserve hash during language-based routing
  useEffect(() => {
    const rawHash = window.location.hash;
    // Normalize hash (replace spaces with underscores)
    const normalizedHash = rawHash ? '#' + normalizeHash(rawHash.slice(1)) : '';
    const currentPath = location.pathname;
    const isSpecialPage = ['/datenschutz', '/impressum', '/spenden', '/kontakt', '/karte'].includes(currentPath);
    
    // Don't redirect special pages
    if (isSpecialPage) return;
    
    // Check if we need to redirect based on language
    const expectedPath = language === 'de' ? '/' : '/en/';
    const needsRedirect = currentPath !== expectedPath && currentPath !== '/datenschutz' && currentPath !== '/impressum' && currentPath !== '/spenden' && currentPath !== '/kontakt';
    
    if (needsRedirect) {
      navigate(expectedPath + normalizedHash, { replace: true });
    }
  }, [language, location.pathname, navigate]);

  // Load menu configuration from YAML files
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        
        // Load German config
        const responseDE = await fetch(fileNameDE);
        const textDE = await responseDE.text();
        const dataDE = yaml.load(textDE);
        if (dataDE._config && dataDE._config.menu) {
          setRoutesDE(dataDE._config.menu);
        }

        // Load English config
        const responseEN = await fetch(fileNameEN);
        const textEN = await responseEN.text();
        const dataEN = yaml.load(textEN);
        if (dataEN._config && dataEN._config.menu) {
          setRoutesEN(dataEN._config.menu);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading menu configuration:', error);
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const currentRoutes = language === 'de' ? routesDE : routesEN;
  const currentFileName = language === 'de' ? fileNameDE : fileNameEN;

  const toggleLanguage = () => {
    const newLanguage = language === 'de' ? 'en' : 'de';
    localStorage.setItem('language', newLanguage);
    setLanguage(newLanguage);

    // Navigate to the base path for the new language, preserving hash if present
    const rawHash = window.location.hash;
    const normalizedHash = rawHash ? '#' + normalizeHash(rawHash.slice(1)) : '';
    const newPath = newLanguage === 'en' ? '/en/' : '/';
    navigate(newPath + normalizedHash);
  };

  if (loading) {
    return (
      <TabProvider>
        <Layout>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '50vh',
            color: 'white',
            fontSize: '20px'
          }}>
            Loading...
          </div>
        </Layout>
      </TabProvider>
    );
  }

  const isSpecialPage = ['/datenschutz', '/impressum', '/spenden', '/kontakt'].includes(location.pathname);

  return (
    <TabProvider>
      <Layout>
        {!isSpecialPage && (
          <Menu routes={currentRoutes} language={language} toggleLanguage={toggleLanguage} />
        )}
        <Routes>
          <Route path="/" element={<ScrollContainer routes={currentRoutes} fileName={currentFileName} />} />
          <Route path="/en/" element={<ScrollContainer routes={currentRoutes} fileName={currentFileName} />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/spenden" element={<Spenden />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="*" element={<ScrollContainer routes={currentRoutes} fileName={currentFileName} />} />
        </Routes>
      </Layout>
    </TabProvider>
  );
}

function App() {
  // Initialize language from localStorage or default to German
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      return savedLanguage;
    }
    // Always default to German
    return 'de';
  });

  return (
    <Router>
      <AppContent language={language} setLanguage={setLanguage} />
    </Router>
  );
}

export default App;