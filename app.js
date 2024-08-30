const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route to fetch current weather and 5-day forecast from OpenWeatherMap API
app.get('/api/weather', async (req, res) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}&units=metric`;

    const { city, lat, lon } = req.query;

    if (city) {
        // Sanitize city input to prevent injection attacks
        const sanitizedCity = encodeURIComponent(city);
        url += `&q=${sanitizedCity}`;
        forecastUrl += `&q=${sanitizedCity}`;
    } else if (lat && lon) {
        // Validate lat and lon input
        if (!isNaN(lat) && !isNaN(lon)) {
            url += `&lat=${lat}&lon=${lon}`;
            forecastUrl += `&lat=${lat}&lon=${lon}`;
        } else {
            return res.status(400).json({ error: 'Invalid coordinates.' });
        }
    } else {
        return res.status(400).json({ error: 'City or coordinates are required.' });
    }

    try {
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            axios.get(url),
            axios.get(forecastUrl),
        ]);

        res.json({
            current: currentWeatherResponse.data,
            forecast: forecastResponse.data,
        });
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch weather data.' });
    }
});

// Serve the HTML file directly
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weather App by Kelvin Karori</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; }
            .weather-info, .forecast-info { margin-top: 20px; }
            img { width: 100px; }
            .info-button { margin-top: 20px; }
            .info-description { display: none; margin-top: 20px; text-align: left; max-width: 600px; margin: auto; }
        </style>
    </head>
    <body>
        <h1>Weather App by Kelvin Karori</h1>
        <input type="text" id="cityInput" placeholder="Enter city name">
        <button onclick="getWeatherByCity()">Get Weather</button>
        <button onclick="getWeatherByLocation()">Use My Location</button>
        
        <div class="weather-info" id="weatherInfo"></div>
        <div class="forecast-info" id="forecastInfo"></div>

        <button class="info-button" onclick="toggleInfo()">Info</button>
        <div class="info-description" id="infoDescription">
            <h3>Product Manager Accelerator Program</h3>
            <p>
                The Product Manager Accelerator Program is designed to support PM professionals through every stage of their career. 
                From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped 
                over hundreds of students fulfill their career aspirations.
            </p>
            <p>
                Our Product Manager Accelerator community are ambitious and committed. Through our program they have learnt, honed 
                and developed new PM and leadership skills, giving them a strong foundation for their future endeavours.
            </p>
        </div>

        <script>
            async function fetchWeather(queryParams) {
                const response = await fetch(\`/api/weather?\${queryParams}\`);
                const data = await response.json();
                if (data.error) {
                    document.getElementById('weatherInfo').innerText = data.error;
                } else {
                    displayWeather(data.current);
                    displayForecast(data.forecast);
                }
            }

            function getWeatherByCity() {
                const city = document.getElementById('cityInput').value;
                fetchWeather(\`city=\${city}\`);
            }

            function getWeatherByLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeather(\`lat=\${latitude}&lon=\${longitude}\`);
                    });
                } else {
                    document.getElementById('weatherInfo').innerText = 'Geolocation is not supported by this browser.';
                }
            }

            function displayWeather(data) {
                const weatherInfo = document.getElementById('weatherInfo');
                weatherInfo.innerHTML = \`
                    <h2>\${data.name}</h2>
                    <img src="http://openweathermap.org/img/wn/\${data.weather[0].icon}@2x.png" alt="Weather icon">
                    <p>\${data.weather[0].description}</p>
                    <p>Temperature: \${data.main.temp} °C</p>
                    <p>Humidity: \${data.main.humidity}%</p>
                    <p>Wind Speed: \${data.wind.speed} m/s</p>
                \`;
            }

            function displayForecast(data) {
                const forecastInfo = document.getElementById('forecastInfo');
                forecastInfo.innerHTML = '<h2>5-Day Forecast</h2>';
                
                const forecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);
                
                forecasts.forEach(forecast => {
                    const date = new Date(forecast.dt_txt).toDateString();
                    forecastInfo.innerHTML += \`
                        <div>
                            <h3>\${date}</h3>
                            <img src="http://openweathermap.org/img/wn/\${forecast.weather[0].icon}@2x.png" alt="Weather icon">
                            <p>\${forecast.weather[0].description}</p>
                            <p>Temperature: \${forecast.main.temp} °C</p>
                            <p>Humidity: \${forecast.main.humidity}%</p>
                            <p>Wind Speed: \${forecast.wind.speed} m/s</p>
                        </div>
                    \`;
                });
            }

            function toggleInfo() {
                const infoDescription = document.getElementById('infoDescription');
                if (infoDescription.style.display === 'none' || infoDescription.style.display === '') {
                    infoDescription.style.display = 'block';
                } else {
                    infoDescription.style.display = 'none';
                }
            }
        </script>
    </body>
    </html>
    `);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

