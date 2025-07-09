import React from 'react';
import './header.css';

const Header = () => {
    return (
        <div className="header">
            <div className="logo">
                <img
                    alt="App Logo"
                    src="./public/images/imgapplogo35-n1hp-200h.png"
                    className="logo-img"
                />
            </div>
            <div className="current-city">
                <span className="city-text">Washington, DC</span>
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="City, Address"
                    className="search-input"
                />
                <img
                    alt="Search Icon"
                    src="./public/images/imgsearchicon520-iz2j-200h.png"
                    className="search-icon"
                />
            </div>
        </div>
    );
};

export default Header;

// Search For city from API through fethcing it data 
// Search bar drop down menu of possible cities while typing in 

// Seach Bar pre-fill search bar the next time they visit the website, the application can retrieve the previously stored city 

