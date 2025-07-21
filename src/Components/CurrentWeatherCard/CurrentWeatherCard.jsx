// React Import: Imports the core React library for component creation.
// CSS Import: Imports component-specific styles.
// Utility Import: Imports helper functions for data manipulation from the API file.
//                - 'convertTemperature': JS Function; Transforms temperature units.
//                - 'formatDate': JS Function; Converts timestamp to readable date/time string.
// Note: Data fetching (e.g., searchCities, getWeatherData) is not managed here;
//       this component receives its data via props from a parent.

import React from 'react';
import { ClipLoader } from 'react-spinners';
import './current-weather-card.css';
// FIXED: Removed duplicate imports - functions are already passed as props
// import {formatDate, convertTemperature } from '../../weather-api.js';

// FIXED: Destructured props correctly - convertTemperature and formatDate come from props, not imports
const CurrentWeatherCard = ({currentWeather, convertTemperature, formatDate, isLoading, appError}) => {
    
    if (isLoading) {
        return (
            <div className="weather-card loading-state">
                <div className="card-content">
                    <span className="loading-message">Loading current weather...</span>
                    <ClipLoader color="#eed6acff" size={50} /> 
                </div>
            </div>

        )
    }

    if (appError) {
        return (
            <div className="weather-card error-state">
                <div className="card-content"> 
                    <span className="error-message">Error: {appError}</span>
                    <span className="error-guidance">Please try a different city.</span>
                </div>
            </div>
        )
    }

   // Component Props (Detailed breakdown - no code, just conceptual placeholders):
    // - 'currentWeather': React Prop; An object containing the current weather conditions.
    //   Purpose: All dynamic weather information displayed on the card comes from this prop.
    //     Expected properties for dynamic display:
    //       - 'temperature': JS Property; Raw temperature value (e.g., in Kelvin).
    //       - 'description': JS Property; Text description of current weather (e.g., "clear sky").
    //       - 'icon': JS Property; Code for the weather condition icon (e.g., "01d").
    //       - 'humidity': JS Property; Humidity percentage (e.g., 78).
    //       - 'windSpeed': JS Property; Wind speed (e.g., 4).
    //       - 'timestamp': JS Property; Unix timestamp for the weather data's observation time.

    // - 'convertTemperature': React Prop; A function passed down from the parent.
    //   Purpose: To convert raw temperature values received in 'currentWeather.temperature'
    //            into user-friendly Celsius or Fahrenheit units for display.
    //   Type: JS Function; Signature: (temp, fromUnit, toUnit) => convertedTemp.

    // - 'formatDate': React Prop; A function passed down from the parent.
    //   Purpose: To convert the 'currentWeather.timestamp' into a human-readable time string for display.
    //   Type: JS Function; Signature: (timestamp) => formattedTimeString.

    // Internal State Management (Not applicable for this purely presentational component):
    // This component is designed as a "Dumb" or "Controlled" component in React.
    // It receives all necessary data via props from its parent ('App.jsx').
    // - 'useState': React Hook; (No direct usage within this component for managing its own data, loading states, or errors).
    // - 'useEffect': React Hook; (No direct usage within this component for fetching data or other side effects).
    // Data fetching, loading indicators, and error handling logic are solely managed by its parent component ('App.jsx').

    // --- Component Logic and Data Preparation ---

    // Conditional Rendering Check: Determine if 'currentWeather' data is available to render the card content.
    //   JS Conditional: If 'currentWeather' is null or undefined, render a placeholder or nothing.
    //   React Conditional Rendering:
    if (currentWeather === null || currentWeather === undefined) {
        return (
            <div className="weather-card no-data-stats">
                <div className="card-content">
                    <span className="no-data-message">No weather data available. Select a city</span>
                    <span className="no-data-guidance">Search for and Select a city above to get started !</span>
                </div>
            </div>
        );
    }

    // Data Destructuring: Extract specific values from the 'currentWeather' object for easier access in JSX.
    //   JS Destructuring:
    //   const { temperature, description, icon, humidity, windSpeed, timestamp } = currentWeather;

    // Data Transformation/Formatting: Prepare values for display using utility functions.
    //   JS Function Call:
    //   const displayTemperatureF = convertTemperature(temperature, 'K', 'F'); // Assuming API returns Kelvin
    //   const displayTemperatureC = convertTemperature(temperature, 'K', 'C'); // Assuming API returns Kelvin
    //   const displayTime = formatDate(timestamp); // Assuming API returns Unix timestamp
    //   const weatherIconSrc = `./public/images/${icon}.png`; // Construct image path. Adjust if using external icon URLs.

    const humidity = currentWeather.humidity; // Assuming humidity is already in percentage
    // Assuming wind speed is already in mph, if not, conversion logic should be applied.
    const windSpeed = currentWeather.windSpeed; // Assuming wind speed is already in mph            
    const currentTime = formatDate(currentWeather.timestamp);
    
    const weatherIconSrc = `https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`; // <--- Updated line

    const displayTemperatureF = convertTemperature(currentWeather.temperature, 'K', 'F'); // Assuming API returns Kelvin
    const displayTemperatureC = convertTemperature(currentWeather.temperature, 'K', 'C'); // Assuming API returns Kelvin
    const weatherDescription = currentWeather.description.charAt(0).toUpperCase() + currentWeather.description.slice(1); // Capitalize first letter of description

    // JSX Structure: Defines the visual layout and incorporates dynamic data.
    //   Outer Div: Main container for the current weather card.
    //   CSS Class: 'weather-card'.

    return (
        <div className="weather-card">
            <div className="card-content">
                <div className="card-header">
                    <span className="header-text">CURRENT WEATHER</span>
                    <span className="time-text">{currentTime}</span>
                </div>
                
                <div className="main-content">
                    <div className="left-section">
                        <img
                            alt="Current Weather Condition Icon"
                            src={weatherIconSrc}
                            className="weather-icon"
                        />
                        <span className="weather-description">{weatherDescription}</span>
                    </div>
                    
                    <div className="center-section">
                        <span className="temp-fahrenheit">{displayTemperatureF}°F</span>
                        <div className="temp-divider"></div>
                        <span className="temp-celsius">{displayTemperatureC}°C</span>
                    </div>
                    
                    <div className="stats-divider"></div>
                    
                    <div className="stats-section">
                        <div className="stat-item">
                            <span className="stat-label">Wind</span>
                            <span className="stat-value">{windSpeed} mph</span>
                        </div>
                        
                        <div className="stat-item">
                            <span className="stat-label">Humidity</span>
                            <span className="stat-value">{humidity} %</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeatherCard;