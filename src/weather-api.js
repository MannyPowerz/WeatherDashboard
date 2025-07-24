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
const API_KEY = "*******************************"; // Replace with your actual key
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"; // FREE
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"; // FREE
const GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/direct"; // FREE

// UTILITY FUNCTIONS (unchanged)
export const convertTemperature = (temp, fromUnit = 'K', toUnit = 'C') => {
    let celsius;
    
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
            celsius = temp - 273.15;
    }
    
    switch (toUnit) {
        case 'F':
            return Math.round((celsius * 9/5) + 32);
        case 'C':
            return Math.round(celsius);
        default:
            return Math.round(celsius);
    }
};

export const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// GEOCODING API (unchanged - still works)
export const searchCities = async (cityName) => {
    try {
        const url = `${GEOCODING_URL}?q=${encodeURIComponent(cityName)}&limit=5&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Invalid API key. Please check your OpenWeatherMap API key.");
            }
            throw new Error(`Failed to search cities: ${response.status}`);
        }
        
        const cities = await response.json();
        
        if (cities.length === 0) {
            return { success: false, error: `No cities found for "${cityName}"` };
        }
        
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

// UPDATED: Current weather using FREE 2.5 API
const getCurrentWeather = async (lat, lon) => {
    try {
        const url = `${CURRENT_WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Invalid API key. Check your OpenWeatherMap API key.");
            }
            throw new Error(`Failed to fetch current weather: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            temperature: data.main.temp,
            feelsLike: data.main.feels_like,
            humidity: data.main.humidity,
            windSpeed: data.wind?.speed || 0,
            windDirection: data.wind?.deg || 0,
            pressure: data.main.pressure,
            visibility: data.visibility || 10000,
            uvIndex: 0, // Not available in 2.5 API
            clouds: data.clouds?.all || 0,
            description: data.weather[0].description,
            main: data.weather[0].main,
            icon: data.weather[0].icon,
            timestamp: data.dt,
            sunrise: data.sys?.sunrise || data.dt,
            sunset: data.sys?.sunset || data.dt
        };
        
    } catch (error) {
        console.error('Error fetching current weather:', error);
        throw error;
    }
};

// UPDATED: 5-day forecast using FREE 2.5 API
const getForecast = async (lat, lon) => {
    try {
        const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            console.warn(`Forecast API failed: ${response.status}, continuing without forecast data`);
            return []; // Return empty array if forecast fails
        }
        
        const data = await response.json();
        
        // Group forecast data by day (API returns 3-hour intervals)
        const dailyForecasts = {};
        
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    timestamp: item.dt,
                    temps: [],
                    humidity: [],
                    descriptions: [],
                    icons: [],
                    windSpeeds: []
                };
            }
            
            dailyForecasts[date].temps.push(item.main.temp);
            dailyForecasts[date].humidity.push(item.main.humidity);
            dailyForecasts[date].descriptions.push(item.weather[0].description);
            dailyForecasts[date].icons.push(item.weather[0].icon);
            dailyForecasts[date].windSpeeds.push(item.wind?.speed || 0);
        });
        
        // Convert to daily format (first 5 days)
        return Object.values(dailyForecasts)
            .slice(0, 5)
            .map(day => ({
                timestamp: day.timestamp,
                temperature: {
                    min: Math.min(...day.temps),
                    max: Math.max(...day.temps),
                    day: day.temps[Math.floor(day.temps.length / 2)] // Middle temp as "day" temp
                },
                humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
                windSpeed: Math.round(day.windSpeeds.reduce((a, b) => a + b, 0) / day.windSpeeds.length * 10) / 10,
                description: day.descriptions[0], // First description of the day
                main: day.descriptions[0],
                icon: day.icons[0], // First icon of the day
                pop: 0 // Probability of precipitation not available in basic forecast
            }));
            
    } catch (error) {
        console.error('Error fetching forecast:', error);
        return []; // Return empty array on error
    }
};

// MAIN FUNCTION: Updated to use 2.5 APIs
export const getWeatherData = async (lat, lon) => {
    try {
        console.log(`🌤️ Fetching weather data for coordinates: ${lat}, ${lon}`);
        
        // Fetch current weather (required)
        const currentWeather = await getCurrentWeather(lat, lon);
        
        // Fetch forecast (optional - won't break if it fails)
        const forecastData = await getForecast(lat, lon);
        
        // Format data to match your component's expected structure
        return {
            success: true,
            data: {
                // Current weather data
                current: currentWeather,
                
                // Daily forecast (converted from 3-hour intervals)
                daily: forecastData,
                
                // Basic hourly data (limited in 2.5 API)
                hourly: [], // Not available in 2.5 current weather API
                
                // Location info
                location: {
                    lat: lat,
                    lon: lon,
                    timezone: "UTC", // Not available in 2.5 API
                    timezoneOffset: 0 // Not available in 2.5 API
                }
            }
        };
        
    } catch (error) {
        console.error('Error in getWeatherData:', error.message);
        return { 
            success: false, 
            error: error.message || "Failed to fetch weather data. Please try again."
        };
    }
};

// HELPER FUNCTIONS (unchanged)
export const getWeatherByCity = async (cityName) => {
    try {
        const cityResult = await searchCities(cityName);
        
        if (!cityResult.success) {
            return cityResult;
        }
        
        const selectedCity = cityResult.cities[0];
        const weatherResult = await getWeatherData(selectedCity.lat, selectedCity.lon);
        
        if (!weatherResult.success) {
            return weatherResult;
        }
        
        return {
            success: true,
            data: {
                city: {
                    name: selectedCity.name,
                    country: selectedCity.country,
                    state: selectedCity.state,
                    displayName: selectedCity.displayName
                },
                ...weatherResult.data
            }
        };
        
    } catch (error) {
        console.error('Error getting weather by city:', error.message);
        return { success: false, error: error.message };
    }
};

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

