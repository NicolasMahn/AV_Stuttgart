import React, { useState, useEffect, useRef } from 'react';
import './Menu.css';
import AV_Logo from '../assets/AV_Logo_Text_Querformat_weiss.svg';

const Menu = () => {
  const [currentTab, setCurrentTab] = useState("Home");
  const tabs = ["Home", "Topiqweqweqwewqeweqwc 1", "Topic 2", "Topic 3", "test"];
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

  useEffect(() => {
    const menuNode = menuRef.current;
    if (menuNode) {
      handleScroll(); // Initial check
      menuNode.addEventListener('scroll', handleScroll);

      return () => {
        menuNode.removeEventListener('scroll', handleScroll);
      };
    }
  }, [menuRef.current]); // Add menuRef.current as a dependency

  return (
    <nav className="menu">
      <div className="menu-header">
        <img src={AV_Logo} alt="Logo" className="menu-logo" />
        <div className="current-tab">{currentTab}</div>
      </div>
      <div className="menu-tabs" ref={menuRef}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-item ${currentTab === tab ? 'active' : ''}`}
            onClick={() => setCurrentTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {showLeftGradient && <div className="left-gradient"></div>}
      {showRightGradient && <div className="right-gradient"></div>}
    </nav>
  );
};

export default Menu;
