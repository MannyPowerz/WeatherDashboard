# WeatherAppDashboard

Learning Based Project for React, JavaScript, CSS, &amp; API usage

# Weather Dashboard App 🌤️

This is a personal learning-based project built with **React.js**, aimed at solidifying my understanding of frontend development and showcasing my growth as I continue learning.

> ✨ At first, I wasn’t sure if I should’ve started with a README, since this was just a learning exercise. But I quickly realized the value in documenting my progress—not just for myself, but to clearly demonstrate how far I’ve come. This README will evolve with the project, marking milestones and accomplishments.

---

## 🚀 Project Summary

The Weather Dashboard is a responsive, modern web app that displays real-time weather data and a 5-day forecast based on user input. Users can search for a city to view temperature (°F/°C), humidity, wind speed, and weather descriptions—all with clean visuals and a user-friendly design.

---

## ✅ Current Features (First Major Milestone Completed)

- ✅ Learned and applied **React basics** (functional components, hooks, component styling)
- ✅ Custom-styled UI with **responsive CSS**
- ✅ Built foundational components:
  - **Header with search bar**
  - **CurrentWeatherCard** (static display)
  - **ForecastTable** with unit toggle button

---

## 💻 Tech Stack

- **Frontend:** React.js, JavaScript, HTML5, CSS3
- **Styling:** Manuale font, custom CSS, responsive media queries
- **API (planned):** [OpenWeather API](https://openweathermap.org/api)
- **Build Tool:** Vite

---

## 📂 Project Setup

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/weather-dashboard.git
   cd weather-dashboard

   ```

2. **Install dependencies:**

bash
npm install

3. **Add your API key:**
   Open `src/config.js` and replace the placeholder with **your own API key** from OpenWeather.

> **Note:** A `config.js` file is used instead of a `.env` file for simplicity, as this is a frontend-only learning project.  
> A `.gitignore` has been added to keep build files, dependencies, and future environment files out of version control.

## ⚠️ API Key Notice

The **API key in this project is not currently active**.  
If you plan to use this project:

- Please **generate your own free API key** by signing up at [OpenWeather API](https://openweathermap.org/api) (use the **2.5 Free Version**).
- Replace the placeholder in the code with your own key.

> **Why no `.env` file?**  
> I understand it is best practice to use an .env file
> Normally, API keys are stored in a `.env` file (environment variables) for security. However, this project **does not use Node.js** for its setup, and `.env` handling in React without Node is impractical for a simple frontend-only build.  
> Because of that, I did not include `.env` management or `.gitignore` for API keys. If you use this in production, ensure you set up secure environment variable handling (e.g., with a backend or CI/CD secrets).

4.  Run Locally with Vite
    Start the development server:

bash
npm run dev

5. Preview Your App
   Once the server is running, open your browser and visit:
   http://localhost:5173

   ## 📂 Project Setup

6. **Clone the repo:**
   ```bash
   git clone https://github.com/MannyPowerz/WeatherDashboard.git
   cd WeatherDashboard
   ```
