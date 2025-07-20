// This function will fetch the current weather data using the weather API
// It will use the latitude and longitude obtained from the geolocation API
    // - parameter lat and lon , apiUrl variable, response arguememt fetching apiurl, data variable argument for getting json of response variable



    // and return the current temperature, wind speed, and humidity percentage. 
    // The current time will be based on the user's geo-location.
    // The temperature will be displayed in both Celsius and Fahrenheit.
    


    // The current weather condition icon will be based on the fetched data.
    // The weather condition icon will be fetched from a local image directory.

// The function will handle errors gracefully and log them to the console   

// CONFIGURATION 
const API_KEY = "d8ef06363dc5a47d53fac7fac06320c1";
const ONE_CALL_URL = "https://api.openweathermap.org/data/3.0/onecall";
const GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/direct";

// UTILITY FUNCTIONS 
// Convert temperature between units
export const convertTemperature = (temp, fromUnit = 'K', toUnit = 'C') => {
    let celsius;
    
    // Convert to Celsius first
    switch (fromUnit) {
        case 'K':
            celsius = temp - 273.15;
            break;
        case 'F':
            celsius = (temp - 32) * 5/9;
            break;
        case 'C':
            celsius = temp;
            break;
        default:
            celsius = temp - 273.15; // Assume Kelvin
    }
    
    // Convert from Celsius to target unit
    switch (toUnit) {
        case 'F':
            return Math.round((celsius * 9/5) + 32);
        case 'C':
            return Math.round(celsius);
        default:
            return Math.round(celsius);
    }
};

// Format timestamp to readable date
export const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
};

// API FUNCTIONS
// Search for cities by name - React compatible
export const searchCities = async (cityName) => {
    try {
        const url = `${GEOCODING_URL}?q=${encodeURIComponent(cityName)}&limit=5&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to search cities: ${response.status}`);
        }
        
        const cities = await response.json();
        
        if (cities.length === 0) {
            return { success: false, error: `No cities found for "${cityName}"` };
        }
        
        // Return formatted city options for React to handle
        return {
            success: true,
            cities: cities.map(city => ({
                id: `${city.lat}-${city.lon}`,
                name: city.name,
                country: city.country,
                state: city.state || '',
                lat: city.lat,
                lon: city.lon,
                displayName: `${city.name}, ${city.state ? city.state + ', ' : ''}${city.country}`
            }))
        };
        
    } catch (error) {
        console.error('Error searching cities:', error.message);
        return { success: false, error: error.message };
    }
};

// Fetch complete weather data using 3.0 One Call API
export const getWeatherData = async (lat, lon) => {
    try {
        // Exclude minutely and alerts to match your original setup
        const url = `${ONE_CALL_URL}?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format data according to 3.0 API structure (matches your documentation)
        return {
            success: true,
            data: {
                // Current weather from data.current
                current: {
                    temperature: data.current.temp,
                    feelsLike: data.current.feels_like,
                    humidity: data.current.humidity,
                    windSpeed: data.current.wind_speed,
                    windDirection: data.current.wind_deg,
                    pressure: data.current.pressure,
                    visibility: data.current.visibility,
                    uvIndex: data.current.uvi,
                    clouds: data.current.clouds,
                    description: data.current.weather[0].description,
                    main: data.current.weather[0].main,
                    icon: data.current.weather[0].icon,
                    timestamp: data.current.dt,
                    sunrise: data.current.sunrise,
                    sunset: data.current.sunset
                },
                // Hourly forecast from data.hourly (first 24 hours)
                hourly: data.hourly.slice(0, 24).map(hour => ({
                    timestamp: hour.dt,
                    temperature: hour.temp,
                    feelsLike: hour.feels_like,
                    humidity: hour.humidity,
                    description: hour.weather[0].description,
                    icon: hour.weather[0].icon,
                    windSpeed: hour.wind_speed,
                    pop: hour.pop // Probability of precipitation
                })),
                // 5-day daily forecast from data.daily
                daily: data.daily.slice(0, 5).map(day => ({
                    timestamp: day.dt,
                    temperature: {
                        min: day.temp.min,
                        max: day.temp.max,
                        day: day.temp.day,
                        night: day.temp.night,
                        morning: day.temp.morn,
                        evening: day.temp.eve
                    },
                    feelsLike: {
                        day: day.feels_like.day,
                        night: day.feels_like.night,
                        morning: day.feels_like.morn,
                        evening: day.feels_like.eve
                    },
                    humidity: day.humidity,
                    windSpeed: day.wind_speed,
                    description: day.weather[0].description,
                    main: day.weather[0].main,
                    icon: day.weather[0].icon,
                    sunrise: day.sunrise,
                    sunset: day.sunset,
                    pop: day.pop, // Probability of precipitation
                    uvIndex: day.uvi,
                    summary: day.summary || day.weather[0].description
                })),
                // Location info
                location: {
                    lat: data.lat,
                    lon: data.lon,
                    timezone: data.timezone,
                    timezoneOffset: data.timezone_offset
                }
            }
        };
        
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        return { success: false, error: error.message };
    }
};

// Get weather data by city name (combines geocoding + weather)
export const getWeatherByCity = async (cityName) => {
    try {
        // Step 1: Get city coordinates
        const cityResult = await searchCities(cityName);
        
        if (!cityResult.success) {
            return cityResult; // Return the error
        }
        
        // If multiple cities, take the first one (most relevant)
        // In React, you can handle multiple cities in the UI
        const selectedCity = cityResult.cities[0];
        
        // Step 2: Get weather data using coordinates
        const weatherResult = await getWeatherData(selectedCity.lat, selectedCity.lon);
        
        if (!weatherResult.success) {
            return weatherResult; // Return the error
        }
        
        // Step 3: Combine city info with weather data
        return {
            success: true,
            data: {
                city: {
                    name: selectedCity.name,
                    country: selectedCity.country,
                    state: selectedCity.state,
                    displayName: selectedCity.displayName
                },
                ...weatherResult.data // Spread current, hourly, daily, location
            }
        };
        
    } catch (error) {
        console.error('Error getting weather by city:', error.message);
        return { success: false, error: error.message };
    }
};

// Get weather by coordinates directly
export const getWeatherByCoordinates = async (lat, lon) => {
    return await getWeatherData(lat, lon);
};

// ===== REACT COMPONENT USAGE EXAMPLES =====
/*
// In your React component:

import { 
    getWeatherByCity, 
    getWeatherByCoordinates, 
    searchCities, 
    convertTemperature 
} from './weatherAPI';

// Basic usage - get weather for a city
const handleGetWeather = async (cityName) => {
    setLoading(true);
    const result = await getWeatherByCity(cityName);
    
    if (result.success) {
        const weather = result.data;
        
        // Current weather
        console.log('Current temp:', weather.current.temperature);
        console.log('Description:', weather.current.description);
        
        // Convert temperature
        const tempC = convertTemperature(weather.current.temperature, 'K', 'C');
        const tempF = convertTemperature(weather.current.temperature, 'K', 'F');
        
        // 5-day forecast
        weather.daily.forEach(day => {
            console.log('Date:', formatDate(day.timestamp));
            console.log('High:', day.temperature.max, 'Low:', day.temperature.min);
        });
        
        setWeatherData(weather);
    } else {
        setError(result.error);
    }
    setLoading(false);
};

// Search cities for selection
const handleCitySearch = async (searchTerm) => {
    const result = await searchCities(searchTerm);
    if (result.success) {
        setCityOptions(result.cities); // Let user pick from multiple cities
    }
};

// Use coordinates (e.g., from geolocation)
const handleGetCurrentLocation = async (lat, lon) => {
    const result = await getWeatherByCoordinates(lat, lon);
    if (result.success) {
        setWeatherData(result.data);
    }
};
*/

