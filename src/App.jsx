import React, {useEffect, useState } from 'react';
import Header from './Components/Header/Header.jsx';
import CurrentWeatherCard from './Components/CurrentWeatherCard/CurrentWeatherCard.jsx';
import ForecastTable from './Components/ForecastTable/ForecastTable.jsx';
import './global.css';
import { getWeatherData, convertTemperature, formatDate } from './weather-api.js';

const App = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [appError, setAppError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    
    useEffect(() => {
        const fetchWeatherDataForSelectedCity = async () => {
            if (!selectedCity) {
                setWeatherData(null); // Fixed: was weatherData(null) - incorrect function call
                return;
            }

            setIsLoading(true);
            setAppError(null);

            try {
                // Fetch weather data for the selected city using its coordinates.
                const result = await getWeatherData(selectedCity.lat, selectedCity.lon);

                if (result.success) {
                    setWeatherData(result.data);
                } else {
                    setAppError(result.error);
                    setWeatherData(null);
                }

            } catch (error) {
                console.error("Error fetching weather data in App:", error);
                setAppError("Failed to fetch weather data. Please try again.");
                setWeatherData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeatherDataForSelectedCity(); // Fixed: Added function call
    }, [selectedCity]); // Fixed: Added dependency array

    const handleCitySelection = (cityData) => {
        console.log("🎯 App received city:", cityData);
        setSelectedCity(cityData);
        setAppError(null);
        //Removed useEffect from inside this function
    };
    return (
        <div className="app">
            <Header onCitySelect={handleCitySelection} />
            
            {/* Debug display - shows selected city */}
            {selectedCity && (
                <div className="selected-city-debug">
                    Selected: {selectedCity.displayName}
                </div>
            )}

            {/* App-level error display */}
            {appError && (
                <div className="app-error">
                    {appError}
                </div>
            )}

            <main className="main">
                {/* CurrentWeatherCard Component: Displays current weather. */}
                {/* React Prop: 'selectedCity' passed down for city name display. */}
                {/* React Prop: 'currentWeather' passed down (data from 'weatherData.current'). */}
                {/* React Prop: 'convertTemperature' utility function passed down. */}
                {/* React Prop: 'formatDate' utility function passed down. */}
                <CurrentWeatherCard 
                    currentWeather={weatherData ? weatherData.current : null}
                    convertTemperature={convertTemperature}
                    formatDate={formatDate}
                    
                    isLoading={isLoading} // <--- Pass isLoading
                    appError={appError}   // <--- Pass appError
                />
                
                <ForecastTable 
                    dailyForecast={weatherData ? weatherData.daily : []}
                    convertTemperature={convertTemperature}
                    
                    isLoading={isLoading} // <--- Pass isLoading
                    appError={appError}   // <--- Pass appError
                />
            </main>
        </div>
    );
};

export default App;