import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Menu.css';
import AV_Logo from '../assets/AV_Logo_weiss.svg';

const Menu = () => {
  const tabs = [
    { name: "Ethik", path: "/" },
    { name: "Auf der Karte", path: "/auf-der-karte" },
    { name: "Ernährung", path: "/ernaerung" },
    { name: "Rezepte", path: "/rezepte" },
    { name: "Weitere Informationen", path: "/weitere-informationen" }
  ];
  
  
  const [currentTab, setCurrentTab] = useState(tabs[0].name); // Define the currentTab state
  const location = useLocation();
  const menuRef = useRef(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  const handleScroll = () => {
    if (menuRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = menuRef.current;
      setShowLeftGradient(scrollLeft > 0);
      setShowRightGradient(scrollLeft < scrollWidth - (clientWidth+1));
    }
  };

  // Update the current tab based on the URL
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname)?.name || "Ethik";
    setCurrentTab(currentTab);
  }, [location]);

  return (
    <nav className="menu">
      <div className="menu-header">
        <img src={AV_Logo} alt="Logo" className="menu-logo" />
        <div className="current-tab">{currentTab}</div>
      </div>
      <div className="menu-tabs" ref={menuRef}>
        {tabs.map(tab => (
          <Link key={tab.name} to={tab.path} className={`tab-item ${currentTab === tab.name ? 'active' : ''}`}>
            {tab.name}
          </Link>
        ))}
      </div>
      {showLeftGradient && <div className="left-gradient"></div>}
      {showRightGradient && <div className="right-gradient"></div>}
    </nav>
  );
};

export default Menu;
