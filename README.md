# Weather App

## Overview

This is a simple weather app built with Node.js and Express. It allows users to get current weather information by entering a city name or using their current location.

## Features

- Fetch current weather by city name or user location.
- Display weather data with icons and other relevant details.
- Date and Time Display: The current date and time are displayed at the top of the page and updated every second.
- Weather Alerts: If any weather alerts are available, they are displayed in bold red text under the current weather details.
- Search History: The app keeps track of the cities you've searched for and displays them as clickable items below the search buttons. Clicking on a history item fetches the weather for that location again.
- Background Image Change Based on Weather: The background of the page changes based on the current weather condition (e.g., clear, cloudy, rainy). This makes the app more visually dynamic.
- Simple and efficient codebase.

## Technologies Used

- Node.js
- Express
- Axios (for API requests)
- OpenWeatherMap API

## How to Run

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Create a `.env` file in the project root and add your OpenWeatherMap API key:
4. Run the app:
5. Open `http://localhost:3000` in your browser to view the weather app.

## Notes

- Ensure Node.js is installed on your machine.
- Replace `your_api_key` in the `.env` file with a valid OpenWeatherMap API key.
