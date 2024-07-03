import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import '../style/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav>
        <div className="nav-container">
          {isMobile && (
            <button className="menu-toggle" onClick={toggleMenu}>
              ☰
            </button>
          )}
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <ul className={`nav-list ${isMenuOpen ? 'open' : ''}`}>
            <li><Link to="/" onClick={toggleMenu}>首页</Link></li>
            <li><Link to="/ai-tool" onClick={toggleMenu}>AI工具</Link></li>
            <li><Link to="/hack-new" onClick={toggleMenu}>全球科技新闻</Link></li>
            <li><Link to="/query" onClick={toggleMenu}>知识问答</Link></li>
            <li><Link to="/machine-learning" onClick={toggleMenu}>机器学习</Link></li>
            <li><Link to="/conversation" onClick={toggleMenu}>AI聊天</Link></li>   
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
