import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Check the current URL path before initializing the app
if (window.location.pathname === '/karte') {
  window.location.href = window.location.origin + '/#/';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


