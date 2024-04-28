import React, { useState, useEffect, useRef } from 'react';
import { useTab } from './TabContext'
import { Link, useLocation } from 'react-router-dom';

import './Menu.css';

const Menu = ({routes, language, toggleLanguage }) => {

  const tabs = routes;
  const [currentTab, setCurrentTab] = useTab();
  const location = useLocation();
  const menuRef = useRef(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const [logo, setLogo] = useState('/assets/AV_Logo_Text_Querformat_weiss.svg'); // State to manage the logo
  const [displayLogo, setDisplayLogo] = useState(true); // State to manage whether to display the logo
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768); // State to check if device is desktop

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
    if (width < 300) {
      setDisplayLogo(false);
    } else {
      setDisplayLogo(true);
      // Set which logo to display
      if (width < 768) {
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

  useEffect(() => {
    const path = location.pathname;
    const foundTab = routes.find(tab => tab.path === path);
    setCurrentTab(foundTab ? foundTab.name : "");
  }, [location, routes, setCurrentTab]);

  return (
    <nav className="menu">    
      <div className="menu-header">
        {displayLogo && <img src={logo} alt="Logo" className="menu-logo" />}
        <div className="current-tab">{currentTab}</div>
        {/*<button onClick={toggleLanguage} className="language-toggle">
          Switch to {language === 'de' ? 'EN' : 'DE'}
        </button>*/}
      </div>
      <div className="menu-tabs" ref={menuRef}>
        &emsp;
        {tabs.map(tab => (
          <Link key={tab.name} to={tab.path} className={`tab-item ${currentTab === tab.name ? 'active' : ''}`}>
            {tab.name}
          </Link>
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
