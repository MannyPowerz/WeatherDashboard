import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './header.css';
import { searchCities } from '../../weather-api.js';

const Header = ({ onCitySelect }) => {
    // ===== STATE MANAGEMENT =====
    const [searchTerm, setSearchTerm] = useState('');
    const [cityOptions, setCityOptions] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previousCities, setPreviousCities] = useState([]);

    // ===== LOAD SAVED DATA FROM LOCAL STORAGE =====
    useEffect(() => {
        try {
            // Load saved city
            const savedCity = localStorage.getItem('lastSelectedCity');
            if (savedCity) {
                const cityData = JSON.parse(savedCity);
                setSelectedCity(cityData);
                console.log("Loaded saved city:", cityData);
            }

            // Load previous cities
            const savedPreviousCities = localStorage.getItem('previousCities');
            if (savedPreviousCities) {
                const cities = JSON.parse(savedPreviousCities);
                setPreviousCities(cities);
                console.log("Loaded previous cities:", cities);
            }
        } catch (error) {
            console.error("Failed to load saved data:", error);
            localStorage.removeItem('lastSelectedCity');
            localStorage.removeItem('previousCities');
        }
    }, []);

    // ===== API SEARCH WITH ERROR HANDLING =====
    useEffect(() => {
        // Show previous cities when search is empty or short
        if (searchTerm.length < 3) {
            if (searchTerm.length === 0 && previousCities.length > 0) {
                // Show previous cities when no input
                const previousOptions = previousCities.map(city => ({
                    ...city,
                    label: `🕒 ${city.label}`, // Add clock icon to show it's previous
                    isPrevious: true
                }));
                setCityOptions(previousOptions);
            } else {
                setCityOptions([]);
            }
            setError(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const delaySearch = setTimeout(async () => {
            try {
                console.log("🔍 Searching for:", searchTerm);
                const result = await searchCities(searchTerm);
                
                if (result.success && Array.isArray(result.cities)) {
                    const searchResults = result.cities.map(city => {
                        let labelText = city.displayName;
                        
                        // Add state if available
                        if (city.state && typeof city.state === 'string' && city.state.trim() !== '') {
                            labelText += `, ${city.state}`;
                        }
                        // Add country if available and not redundant with state
                        if (city.country && typeof city.country === 'string' && city.country.trim() !== '') {
                            if (!city.state || city.country.toLowerCase() !== city.state.toLowerCase()) {
                                labelText += `, ${city.country}`;
                            }
                        }

                        return {
                            value: city.id,
                            label: labelText,
                            cityData: city,
                            isPrevious: false
                        };
                    });

                    // Combine previous cities (at top) with search results
                    const previousOptionsFiltered = previousCities
                        .filter(prev =>
                            // Only show previous cities that match the search term
                            prev.label.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(city => ({
                            ...city,
                            label: `🕒 ${city.label}`,
                            isPrevious: true
                        }));

                    // Filter out duplicates from searchResults that are already in previousOptionsFiltered
                    const uniqueSearchResults = searchResults.filter(
                        searchRes => !previousOptionsFiltered.some(prev => prev.value === searchRes.value)
                    );

                    const combinedOptions = [...previousOptionsFiltered, ...uniqueSearchResults];
                    setCityOptions(combinedOptions);
                    setError(null);
                    console.log("✅ Found cities:", combinedOptions.length);
                } else {
                    setError(result.error || "No cities found");
                    setCityOptions([]);
                    console.log("⚠️ API error:", result.error);
                }
            } catch (error) {
                console.error("❌ Search failed:", error);
                setError("Unable to search cities. Please check your connection and try again.");
                setCityOptions([]);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => {
            clearTimeout(delaySearch);
        };
    }, [searchTerm, previousCities]);

    // ===== UTILITY FUNCTIONS =====
    const saveToPreviousCities = (cityOption) => {
        try {
            // Get existing previous cities, ensuring no duplicates and limited size
            const existing = [...previousCities];
            
            // Remove the city if it already exists (to avoid duplicates)
            const filtered = existing.filter(city => city.value !== cityOption.value);
            
            // Add the new city to the beginning
            const updated = [cityOption, ...filtered].slice(0, 3); // Keep only 3 most recent
            
            // Update state and localStorage
            setPreviousCities(updated);
            localStorage.setItem('previousCities', JSON.stringify(updated));
            console.log("Saved to previous cities:", updated);
        } catch (error) {
            console.error("Failed to save to previous cities:", error);
        }
    };

    // ===== EVENT HANDLERS =====
    const handleSearchChange = (inputValue) => {
        // Basic sanitization: remove characters not typically in city/address names
        const cleanInput = inputValue.replace(/[^a-zA-Z\s,\-.]/g, ''); // Added period for addresses
        setSearchTerm(cleanInput);
    };

    const handleCitySelect = (selectedOption) => {
        console.log("📤 Header sending city:", selectedOption.cityData);
        
        // Create clean option for storage (without clock icon or isPrevious flag)
        const cleanOption = {
            value: selectedOption.value,
            label: selectedOption.isPrevious ? 
                selectedOption.label.replace('🕒 ', '') : // Remove clock icon for storage
                selectedOption.label,
            cityData: selectedOption.cityData,
            // isPrevious should not be stored in previousCities
        };
        
        setSelectedCity(cleanOption);
        setSearchTerm('');
        setCityOptions([]);
        setError(null);

        // Save to localStorage
        try {
            localStorage.setItem('lastSelectedCity', JSON.stringify(cleanOption));
        } catch (error) {
            console.error("Failed to save city to localStorage:", error);
        }

        // Save to previous cities list
        saveToPreviousCities(cleanOption);

        // Send to parent component
        if (onCitySelect) {
            onCitySelect(selectedOption.cityData);
        }
    };

    const handleClearCity = () => {
        setSelectedCity(null);
        localStorage.removeItem('lastSelectedCity');
        setSearchTerm('');
        setError(null);
        // Show previous cities when clearing, if any exist
        if (previousCities.length > 0) {
            const previousOptions = previousCities.map(city => ({
                ...city,
                label: `🕒 ${city.label}`,
                isPrevious: true
            }));
            setCityOptions(previousOptions);
        } else {
            setCityOptions([]);
        }
    };

    return (
        <div className="header">
            {/* ===== LOGO SECTION ===== */}
            <div className="logo">
                <img
                    alt="App Logo"
                    src="./public/images/imgapplogo35-n1hp-200h.png"
                    className="logo-img"
                />
            </div>

            {/* ===== CURRENT CITY DISPLAY ===== */}
            <div className="current-city">
                <span className="city-text">
                    {selectedCity ? selectedCity.label : "Select a city"}
                </span>
                {selectedCity && (
                    <button 
                        onClick={handleClearCity}
                        className="clear-city-button"
                        title="Clear selected city"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* ===== SEARCH BAR ===== */}
            <div className="search-bar">
                <div className="search-container">
                    <Select
                        className="header-select"
                        classNamePrefix="react-select"
                        placeholder="Search for a city..."
                        inputValue={searchTerm}
                        onInputChange={handleSearchChange}
                        options={cityOptions}
                        onChange={handleCitySelect}
                        value={null} // Always show placeholder
                        isClearable={false} // Managed by handleClearCity if needed
                        isSearchable={true}
                        isLoading={isLoading}
                        loadingMessage={() => "🔍 Searching cities..."}
                        noOptionsMessage={() => {
                            if (isLoading) return "Searching...";
                            if (searchTerm.length < 3 && previousCities.length === 0) return "Type 3+ characters to search";
                            if (searchTerm.length < 3) return "Previous cities shown above";
                            if (error) return `Error: ${error}`; // Display specific error message
                            return "No cities found";
                        }}
                        onMenuOpen={() => {
                            // Show previous cities when opening the menu with no search term
                            if (searchTerm.length === 0 && previousCities.length > 0) {
                                const previousOptions = previousCities.map(city => ({
                                    ...city,
                                    label: `🕒 ${city.label}`,
                                    isPrevious: true
                                }));
                                setCityOptions(previousOptions);
                            }
                        }}
                    />
                    
                    <img
                        alt="Search Icon"
                        src="./public/images/imgsearchicon520-iz2j-200h.png"
                        className="search-icon"
                    />
                </div>
                
                {/* ERROR MESSAGE DISPLAY */}
                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;