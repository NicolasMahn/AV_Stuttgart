import React, { useState, useEffect, useRef } from 'react';
import { useTab } from './TabContext'

import './Menu.css';

const Menu = ({routes, language, toggleLanguage }) => {

  const tabs = routes;
  const [currentTab, setCurrentTab] = useTab();
  const menuRef = useRef(null);
  const tabRefs = useRef({});
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const [logo, setLogo] = useState('/assets/AV_Logo_Text_Querformat_weiss.svg'); // State to manage the logo
  const [displayLogo, setDisplayLogo] = useState(true); // State to manage whether to display the logo
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768); // State to check if device is desktop

  // Function to scroll to a section
  const scrollToSection = (sectionKey) => {
    const element = document.getElementById(sectionKey);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL hash
      window.history.pushState(null, '', `#${sectionKey}`);
    }
  };

  // Scroll active tab into view when currentTab changes
  useEffect(() => {
    const activeRoute = routes.find(route => route.name === currentTab);
    if (activeRoute && tabRefs.current[activeRoute.key] && menuRef.current) {
      const tabElement = tabRefs.current[activeRoute.key];
      const menuElement = menuRef.current;
      
      // Calculate if tab is out of view
      const tabLeft = tabElement.offsetLeft;
      const tabRight = tabLeft + tabElement.offsetWidth;
      const menuScrollLeft = menuElement.scrollLeft;
      const menuWidth = menuElement.clientWidth;
      const menuScrollRight = menuScrollLeft + menuWidth;
      
      // Scroll the tab into view if it's not fully visible
      if (tabLeft < menuScrollLeft + 20) {
        // Tab is cut off on the left
        menuElement.scrollTo({ left: tabLeft - 50, behavior: 'smooth' });
      } else if (tabRight > menuScrollRight - 20) {
        // Tab is cut off on the right
        menuElement.scrollTo({ left: tabRight - menuWidth + 50, behavior: 'smooth' });
      }
    }
  }, [currentTab, routes]);

  const handleResize = () => {
    updateDeviceType(); // Updates if the device is a desktop or not
    updateLogoAndDisplay(); // Updates the logo display
    handleScroll(); // Checks if scrolling is needed
  };

  // Function to update whether the device is desktop or not
  const updateDeviceType = () => {
    setIsDesktop(window.innerWidth > 768);
  };

  const updateLogoAndDisplay = () => {
    const width = window.innerWidth;
    // Set logo visibility
    if (width < 150) {
      setDisplayLogo(false);
    } else {
      setDisplayLogo(true);
      // Set which logo to display
      if (width < 300) {
        setLogo('/assets/AV_Logo_weiss.svg');
      } else {
        setLogo('/assets/AV_Logo_Text_Querformat_weiss.svg');
      }
    }
  };
  

  const handleScroll = () => {
    if (menuRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = menuRef.current;
      setShowLeftGradient(scrollLeft > 0);
      setShowRightGradient(scrollLeft < scrollWidth - (clientWidth+1));
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    menuRef.current.scrollBy({ left: -300, behavior: 'smooth' }); // Adjust scroll amount as needed
  };

  const scrollRight = () => {
    menuRef.current.scrollBy({ left: 300, behavior: 'smooth' }); // Adjust scroll amount as needed
  };

  // changes rendering on resizing
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adding a button for easier scrolling when on pc
  useEffect(() => {
    window.addEventListener('resize', updateDeviceType);
    updateDeviceType(); // Initial call

    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  // Changing Logo depending on device size
  useEffect(() => {
    window.addEventListener('resize', updateLogoAndDisplay);
    updateLogoAndDisplay(); // Initial call

    return () => window.removeEventListener('resize', updateLogoAndDisplay);
  }, []);

  // The Scroll-logic of the Tabbar
  useEffect(() => {
    const menuNode = menuRef.current;
    if (menuNode) {
      handleScroll(); // Initial check
      menuNode.addEventListener('scroll', handleScroll);

      return () => {
        menuNode.removeEventListener('scroll', handleScroll);
      };
    }
  }, [menuRef.current]);

  return (
    <nav className="menu">    
      <div className="menu-header">
        {displayLogo && <img src={logo} alt="Logo" className="menu-logo" />}
        <button onClick={toggleLanguage} className="language-toggle" aria-label="Switch language">
          <img 
            src={language === 'de' ? '/assets/Flag_EN.svg' : '/assets/Flag_DE.svg'} 
            alt={language === 'de' ? 'Switch to English' : 'Switch to German'} 
            className="language-flag"
          />
        </button>
      </div>
      <div className="menu-tabs" ref={menuRef}>
        &emsp;
        {tabs.map(tab => (
          <button 
            key={tab.key}
            ref={(el) => (tabRefs.current[tab.key] = el)}
            onClick={() => scrollToSection(tab.key)} 
            className={`tab-item ${currentTab === tab.name ? 'active' : ''}`}
          >
            {tab.name}
          </button>
        ))}
        &ensp;
      </div>
      {showLeftGradient && <div className="gradient" id="left-gradient"></div>}
      {showRightGradient && <div className="gradient" id="right-gradient"></div>}
      {isDesktop && showLeftGradient && (
        <button onClick={scrollLeft} className="scroll-button left">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
            <polygon points="15,0 0,12 15,24" />
          </svg>
        </button>
      )}
      {isDesktop && showRightGradient && (  
        <button onClick={scrollRight} className="scroll-button right">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
            <polygon points="9,0 24,12 9,24" />
          </svg>
        </button>
      )}
    </nav>
  );
};

export default Menu;
