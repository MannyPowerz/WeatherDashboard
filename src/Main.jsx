import React from 'react'; // Keep this
import ReactDOM from 'react-dom/client'; // Keep this for createRoot

import { StrictMode } from 'react'; // Keep StrictMode import

// This is your actual root application component, which will contain the router.
import App from './App.jsx'; // <--- This App.jsx will now contain your Router and DashboardLayout

// Import your chosen global stylesheet
import './global.css';

// Render the main App component into the DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);