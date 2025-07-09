import React from 'react';
import Header from './Components/Header/Header.jsx';
import CurrentWeatherCard from './Components/CurrentWeatherCard/CurrentWeatherCard.jsx';
import ForecastTable from './Components/ForecastTable/ForecastTable.jsx';
import './global.css';

const App = () => {
    return (
        <div className="app">
            <Header />
            <main className="main">
                <CurrentWeatherCard />
                <ForecastTable />
            </main>
        </div>
    );
};

export default App;

// Display loading indicator when entering city in header search bar

// Error Messaage rendered in App still dhowing header but not <CurrentWeatherCard /> & <ForecastTable /> such as No results found 

// Responive design for Mobile Users 

