import React from 'react';
import twitterLogo from '../../assets/twitter.png';
import './Header.css';

const Header = () => (
  <div className="Header">
    <div className="Header-logo">
      <img width="40px" height="40px" src={twitterLogo} alt="twitter_logo" />
      {' '}
      Twitter API Demo
    </div>
  </div>
);

export default Header;
