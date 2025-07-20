import React, { useState } from 'react';
import Header from './Components/Header/Header.jsx';
import CurrentWeatherCard from './Components/CurrentWeatherCard/CurrentWeatherCard.jsx';
import ForecastTable from './Components/ForecastTable/ForecastTable.jsx';
import './global.css';

const App = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [appError, setAppError] = useState(null);

    const handleCitySelection = (cityData) => {
        console.log("🎯 App received city:", cityData);
        setSelectedCity(cityData);
        setAppError(null);
        
        // TODO: Here you'll later add weather data fetching
        // When you implement weather fetching, you'll add:
        // const [weatherData, setWeatherData] = useState(null);
        // fetchWeatherData(cityData);
    };

    return (
        <div className="app">
            <Header onCitySelect={handleCitySelection} />
            
            {/* Debug display - shows selected city */}
            {selectedCity && (
                <div className="selected-city-debug">
                    ✅ Selected: {selectedCity.displayName}
                </div>
            )}

            {/* App-level error display */}
            {appError && (
                <div className="app-error">
                    ❌ {appError}
                </div>
            )}

            <main className="main">
                <CurrentWeatherCard />
                <ForecastTable />
            </main>
        </div>
    );
};

export default App;