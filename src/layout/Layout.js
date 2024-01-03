import React from 'react';
import './Layout.css'; 
import instagram from '../assets/instagram.svg'
import facebook from '../assets/facebook.svg'

const Layout = ({ children }) => {
  return (
    <div className="Layout">

      <main>{children}</main>

      <footer className="App-footer">
        <div className="social-links">
            <a href="https://www.instagram.com/activistsforthevictims_s/" target="_blank" rel="noopener noreferrer">
                <img src={instagram} alt="Instagram" />
            </a>
            <a href="https://www.facebook.com/ActivistsForTheVictims" target="_blank" rel="noopener noreferrer">
                <img src={facebook} alt="Facebook" />
            </a>
        </div>

        <a href="https://www.activistsforthevictims.de/impressum/" target="_blank" rel="noopener noreferrer">Impressum</a>
        <a href="https://www.activistsforthevictims.de/datenschutzerklaerung/" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>
        <a href="https://www.activistsforthevictims.de/spenden/" target="_blank" rel="noopener noreferrer">Spenden</a>
      </footer>
    </div>
  );
};

export default Layout;
