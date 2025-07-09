import React from 'react';
import './current-weather-card.css';

const CurrentWeatherCard = () => {
    return (
        <div className="weather-card">
            <div className="card-content">
                <div className="card-header">
                    <span className="header-text">CURRENT WEATHER</span>
                    <span className="time-text">4:05 PM</span>
                </div>
                
                <div className="main-content">
                    <div className="left-section">
                        <img
                            alt="Current Weather Condition Icon"
                            src="./public/images/imgcurrentweatherconditionicon87-m47n-200h.png"
                            className="weather-icon"
                        />
                        <span className="weather-description">Sunny</span>
                    </div>
                    
                    <div className="center-section">
                        <span className="temp-fahrenheit">90°F</span>
                        <div className="temp-divider"></div>
                        <span className="temp-celsius">32°C</span>
                    </div>
                    
                    <div className="stats-divider"></div>
                    
                    <div className="stats-section">
                        <div className="stat-item">
                            <span className="stat-label">Wind</span>
                            <span className="stat-value">4 mph</span>
                        </div>
                        
                        <div className="stat-item">
                            <span className="stat-label">Humidity</span>
                            <span className="stat-value">78 %</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeatherCard;

// Current Time based on current geo-location

// Current Temprature in Celcius & Farenhiet baed on fethced data 

// Current Windspeed 
// Current Humidity Percentage 

// Current Weather Icons based on weather conditions find from figma

