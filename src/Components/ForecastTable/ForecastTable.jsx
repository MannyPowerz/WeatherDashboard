import React, { useState } from 'react';
import './forecast-table.css';

const ForecastTable = () => {
    const [temperatureUnit, setTemperatureUnit] = useState('F');
    
    const forecastData = [
        {
            day: 'TODAY',
            date: '7/8',
            high: temperatureUnit === 'F' ? 93 : 34,
            low: temperatureUnit === 'F' ? 72 : 22,
            description: 'Plenty of sunshine',
            humidity: 53,
            icon: './public/images/imgcurrentweatherconditionicon87-m47n-200h.png'
        },
        {
            day: 'WED',
            date: '7/9',
            high: temperatureUnit === 'F' ? 91 : 33,
            low: temperatureUnit === 'F' ? 74 : 23,
            description: 'Partly cloudy',
            humidity: 58,
            icon: './public/images/imgcurrentweatherconditionconi162-99dm-200w.png'
        },
        {
            day: 'THU',
            date: '7/10',
            high: temperatureUnit === 'F' ? 87 : 31,
            low: temperatureUnit === 'F' ? 70 : 21,
            description: 'Light rain expected',
            humidity: 65,
            icon: './public/images/imgcurrentweatherconditionconi162-99dm-200w.png'
        },
        {
            day: 'FRI',
            date: '7/11',
            high: temperatureUnit === 'F' ? 89 : 32,
            low: temperatureUnit === 'F' ? 73 : 23,
            description: 'Cloudy and foggy',
            humidity: 61,
            icon: './public/images/imgcurrentweatherconditionconi162-99dm-200w.png'
        },
        {
            day: 'SAT',
            date: '7/12',
            high: temperatureUnit === 'F' ? 95 : 35,
            low: temperatureUnit === 'F' ? 76 : 24,
            description: 'Rain in afternoon',
            humidity: 55,
            icon: './public/images/imgcurrentweatherconditionconi162-99dm-200w.png'
        }
    ];

    const toggleTemperatureUnit = () => {
        setTemperatureUnit(prev => prev === 'F' ? 'C' : 'F');
    };

    return (
        <div className="forecast-table">
            <div className="table-header">
                <span className="header-title">5-DAY WEATHER FORECAST</span>
            </div>
            
            <div className="table-body">
                {forecastData.map((day, index) => (
                    <div key={index} className="table-row">
                        <div className="date-col">
                            <span className="day-text">
                                <span className="day-name">{day.day}</span>
                                <br />
                                <span className="date-text">{day.date}</span>
                            </span>
                        </div>
                        
                        <div className="icon-col">
                            <img
                                alt={`Weather condition for ${day.day}`}
                                src={day.icon}
                                className="weather-icon"
                            />
                        </div>
                        
                        <div className="temp-col">
                            <button 
                                className="temp-high"
                                onClick={toggleTemperatureUnit}
                                title="Click to toggle between °F and °C"
                            >
                                {day.high}°{temperatureUnit}
                            </button>
                            <button 
                                className="temp-low"
                                onClick={toggleTemperatureUnit}
                                title="Click to toggle between °F and °C"
                            >
                                {day.low}°{temperatureUnit}
                            </button>
                        </div>
                        
                        <div className="desc-col">
                            <span className="description">{day.description}</span>
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
                ))}
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

