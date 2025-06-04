import React from 'react';
import { Link } from 'react-router-dom';

import './Layout.css'; 

const Layout = ({ children }) => {    
  return (
    <div className="Layout">

      <main>{children}</main>

      <footer className="App-footer">
        <div className="social-links">
          <a href="mailto:activistsforthevictims_stuttgart@protonmail.com" target="_blank" rel="noopener noreferrer">
              <img src='/assets/kontakt.svg' alt="Email Kontakt" />
          </a>
          <a href="https://www.instagram.com/acvi.stuttgart?igsh=NWFnaGx5YnRzdGdo" target="_blank" rel="noopener noreferrer">
              <img src='/assets/instagram.svg' alt="Instagram" />
          </a>
          <a href="https://www.facebook.com/ActivistsForTheVictims" target="_blank" rel="noopener noreferrer">
              <img src='/assets/facebook.svg' alt="Facebook" />
          </a>
          <a href="https://www.activistsforthevictims.de/" target="_blank" rel="noopener noreferrer">
              <img src='/assets/internet.svg' alt="Website" />
          </a>
        </div>
        <span>
          <Link to="/datenschutz">Datenschutzerklärung</Link>
          <Link to="/impressum">Impressum</Link>
          {//<Link to="/spenden">Spenden (in dev)</Link>
          }
        </span>
      </footer>
    </div>
  );
};

export default Layout;
