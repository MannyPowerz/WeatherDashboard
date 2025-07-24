import React, { useState } from 'react';
import './forecast-table.css';

const ForecastTable = ({dailyForecast, convertTemperature, formatDate, isLoading, appError}) => {
    const [temperatureUnit, setTemperatureUnit] = useState('F');

// Loads when current weather data is fetched after city selection in search bar useEffect for depency of selectedCity

// 

    const toggleTemperatureUnit = () => {
        setTemperatureUnit(prev => prev === 'F' ? 'C' : 'F');
    };

    if (isLoading) {
        // Return JSX for a loading state.
        return (
            <div className="forecast-table loading-state">
                <div className="table-header">
                    <span className="header-title">5-DAY WEATHER FORECAST</span>
                </div>
                <div className="table-body">
                    <div className="loading-message">Loading forecast data...</div>
                    {/* You could add a loading spinner icon here */}
                </div>
            </div>
        );
    }

    if (!dailyForecast || dailyForecast.length === 0 || appError) {
        // Return JSX for a "No forecast data" message.
        return (
            <div className="forecast-table no-data-state">
                <div className="table-header">
                    <span className="header-title">5-DAY WEATHER FORECAST</span>
                </div>
                <div className="table-body">
                    <div className="no-data-message">No 5-day forecast available.</div>
                    {/* Optional: Add guidance like "Select a city in the header." */}
                </div>
                <div className="error-message">
                    {appError || "Please select a city to view the forecast."}
                </div>
            </div>
        );
    }

    // const forecastData = [
    //     {
    //         day: 'TODAY',
    //         date: '7/8',
    //         high: temperatureUnit === 'F' ? 93 : 34,
    //         low: temperatureUnit === 'F' ? 72 : 22,
    //         description: 'Plenty of sunshine',
    //         humidity: 53,
    //         icon: './public/images/imgcurrentweatherconditionicon87-m47n-200h.png'
    //     },
    //     {
    //         day: 'WED',
    //         date: '7/9',
    //         high: temperatureUnit === 'F' ? 91 : 33,
    //         low: temperatureUnit === 'F' ? 74 : 23,
    //         description: 'Partly cloudy',
    //         humidity: 58,
    //         icon: './public/images/imgcurrentweatherconditionconi162-99dm-200w.png'
    //     },
    //     {
    //         day: 'THU',
    //         date: '7/10',
    //         high: temperatureUnit === 'F' ? 87 : 31,
    //         low: temperatureUnit === 'F' ? 70 : 21,
    //         description: 'Light rain expected',
    //         humidity: 65,
    //         icon: './public/images/imgcurrentweatherconditionconi162-99dm-200w.png'
    //     },
    //     {
    //         day: 'FRI',
    //         date: '7/11',
    //         high: temperatureUnit === 'F' ? 89 : 32,
    //         low: temperatureUnit === 'F' ? 73 : 23,
    //         description: 'Cloudy and foggy',
    //         humidity: 61,
    //         icon: './public/images/imgcurrentweatherconditionconi162-99dm-200w.png'
    //     },
    //     {
    //         day: 'SAT',
    //         date: '7/12',
    //         high: temperatureUnit === 'F' ? 95 : 35,
    //         low: temperatureUnit === 'F' ? 76 : 24,
    //         description: 'Rain in afternoon',
    //         humidity: 55,
    //         icon: './public/images/imgcurrentweatherconditionconi162-99dm-200w.png'
    //     }
    // ];


    return (
        <div className="forecast-table">
            <div className="table-header">
                <span className="header-title">5-DAY WEATHER FORECAST</span>
            </div>
            
            <div className="table-body">
                {dailyForecast.map((day, index) => {
                    const dayName = formatDate(day.timestamp, { weekday: 'short' }).toUpperCase();
                    const dateText = formatDate(day.timestamp, { month: 'numeric', day: 'numeric' });

                    const highTemp = convertTemperature(day.high, 'K', temperatureUnit);
                    const lowTemp = convertTemperature(day.low, 'K', temperatureUnit);

                    const descriptionText = day.description.charAt(0).toUpperCase() + day.description.slice(1);

                    const weatherIconSrc = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;

                    return (
                        <div key={index || day.timestamp} className="table-row">
                            <div className="date-col">
                                <span className="day-text">
                                    <span className="day-name">{dayName}</span>
                                    <br />
                                    <span className="date-text">{dateText}</span>
                                </span>
                            </div>
                            
                            <div className="icon-col">
                                <img
                                    alt={`Weather condition for ${dayName}`}
                                    src={weatherIconSrc}
                                    className="weather-icon"
                                />
                            </div>
                            
                            <div className="temp-col">
                                <button 
                                    className="temp-high"
                                    onClick={toggleTemperatureUnit}
                                    title="Click to toggle between °F and °C"
                                >
                                    {highTemp}°{temperatureUnit}
                                </button>
                                <button 
                                    className="temp-low"
                                    onClick={toggleTemperatureUnit}
                                    title="Click to toggle between °F and °C"
                                >
                                    {lowTemp}°{temperatureUnit}
                                </button>
                            </div>
                            
                            <div className="desc-col">
                                <span className="description">{descriptionText}</span>
                            </div>
                            
                            <div className="humidity-col">
                                <span className="humidity-text">{day.humidity}%</span>
                                <img
                                    alt="Humidity icon"
                                    src="./public/images/imghygrometeri164-7vbs-200h.png"
                                    className="humidity-icon"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ForecastTable;

// Update date when date changes

// Daily Temprature High and Low in Celcius & Farenhiet based on fethced data 
// Daily Humidty Percetage for 5 day Forecast

// Weather Icons based on weather conditions find from figma

// Weather Description based on overview of weather dynamics during the day 

// Toggle Temprature to and from Celcius & Farenheight based on data fetched

