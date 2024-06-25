import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png'; 
import '../style/Header.css'; 

const Header = () => {
  return (
    <header>
      <nav>
        <ul className="nav-list">
          <li className="logo">
              <img src={logo} alt="Logo" />
          </li>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/ai-tool">Artificial Intelligence Tool</Link></li>
          <li><Link to="/hack-new">Hack New</Link></li>
          <li><Link to="/query">Query</Link></li>
          <li><Link to="/machine-learning">Machine Learning</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;