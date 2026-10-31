// import React, { useEffect, useState } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Line } from "react-chartjs-2";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const API_KEY = "cb375db859dc552487a4d03fab36d93e"; // Replace with your OpenWeatherMap API key
// const CITY = "Hyderabad";

// export default function App() {
//   const [current, setCurrent] = useState(null);
//   const [forecast, setForecast] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchWeather() {
//       try {
//         // 1. Fetch Current Weather
//         const resWeather = await fetch(
//           `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
//         );
//         if (!resWeather.ok) throw new Error("City not found or invalid API key");
//         const weatherData = await resWeather.json();
//         setCurrent(weatherData);

//         // 2. Fetch 5-Day / 3-Hour Forecast
//         const resForecast = await fetch(
//           `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`
//         );
//         const forecastData = await resForecast.json();
        
//         // Take first 8 readings (next 24 hours in 3-hour intervals)
//         setForecast(forecastData.list.slice(0, 8));
//       } catch (err) {
//         setError(err.message || "Failed to load weather data");
//       }
//     }

//     fetchWeather();
//   }, []);

//   // Prepare chart data format
//   const chartData = {
//     labels: forecast.map((item) => item.dt_txt.split(" ")[1].slice(0, 5)), // Extracts 'HH:MM'
//     datasets: [
//       {
//         label: "Temperature (°C)",
//         data: forecast.map((item) => item.main.temp),
//         borderColor: "rgb(75, 192, 192)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         tension: 0.3,
//       },
//     ],
//   };

//   return (
//     <div style={{ maxWidth: 700, margin: "30px auto", fontFamily: "sans-serif" }}>
//       <h2>Weather Dashboard - {CITY}</h2>

//       {error && <p style={{ color: "red" }}>Error: {error}</p>}

//       {/* Current Weather Card */}
//       {current ? (
//         <div style={{ background: "#f0f4f8", padding: 16, borderRadius: 8 }}>
//           <p><strong>Temperature:</strong> {current.main.temp}°C</p>
//           <p><strong>Feels Like:</strong> {current.main.feels_like}°C</p>
//           <p><strong>Humidity:</strong> {current.main.humidity}%</p>
//           <p><strong>Condition:</strong> {current.weather[0].description}</p>
//           <p><strong>Wind Speed:</strong> {current.wind.speed} m/s</p>
//         </div>
//       ) : (
//         <p>Loading current weather...</p>
//       )}

//       {/* Forecast Line Chart */}
//       <h3 style={{ marginTop: 30 }}>Upcoming Temperature Trend</h3>
//       {forecast.length > 0 ? (
//         <Line data={chartData} />
//       ) : (
//         <p>Loading forecast graph...</p>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";

const API_KEY = "cb375db859dc552487a4d03fab36d93e";
const CITY = "Hyderabad";

export default function App() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWeather() {
      try {
        // 1. Fetch current weather
        const resWeather = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
        );
        if (!resWeather.ok) throw new Error("City not found or invalid API key");
        const weatherData = await resWeather.json();
        setCurrent(weatherData);

        // 2. Fetch forecast data
        const resForecast = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await resForecast.json();
        
        // Take the next 8 readings (24-hour window)
        setForecast(forecastData.list.slice(0, 8));
      } catch (err) {
        setError(err.message || "Failed to load weather data");
      }
    }

    fetchWeather();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "30px auto", fontFamily: "sans-serif" }}>
      <h2>Weather Information - {CITY}</h2>

      {/* Error message */}
      {error && (
        <div style={{ background: "#ffe6e6", padding: 10, border: "1px solid red", marginBottom: 20 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Current Weather Section */}
      {current ? (
        <div style={{ background: "#f4f4f4", padding: 15, borderRadius: 6, marginBottom: 20 }}>
          <h3>Current Weather</h3>
          <p><strong>Temperature:</strong> {current.main.temp} °C</p>
          <p><strong>Feels Like:</strong> {current.main.feels_like} °C</p>
          <p><strong>Humidity:</strong> {current.main.humidity}%</p>
          <p><strong>Condition:</strong> {current.weather[0].description}</p>
          <p><strong>Wind Speed:</strong> {current.wind.speed} m/s</p>
        </div>
      ) : (
        <p>Loading current weather...</p>
      )}

      {/* Forecast List (Text/Table instead of Chart) */}
      <h3>Upcoming Forecast (Next 24 Hours)</h3>
      {forecast.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {forecast.map((item, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <span>{item.dt_txt}</span>
              <span><strong>{item.main.temp} °C</strong> ({item.weather[0].main})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading forecast list...</p>
      )}
    </div>
  );
}




// import React, { useEffect, useState } from "react";

// const API_KEY = "cb375db859dc552487a4d03fab36d93e";
// const CITY = "Hyderabad";

// export default function App() {
//   const [weather, setWeather] = useState(null);

//   useEffect(() => {
//     fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`)
//       .then((res) => res.json())
//       .then((data) => setWeather(data));
//   }, []);

//   if (!weather) return <h2>Loading...</h2>;

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
//       <h1>Weather in {weather.name}</h1>
//       <p>Temperature: {weather.main.temp} °C</p>
//       <p>Condition: {weather.weather[0].description}</p>
//       <p>Humidity: {weather.main.humidity}%</p>
//       <p>Wind: {weather.wind.speed} m/s</p>
//     </div>
//   );
// }