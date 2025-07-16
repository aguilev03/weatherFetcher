# 🌤️ Weather Fetcher CLI

A simple Node.js command-line app that fetches and displays the current temperature based on a U.S. ZIP code. This project uses the [Zippopotam.us API](http://api.zippopotam.us/) for geolocation and [Open-Meteo](https://open-meteo.com/) for weather data.

---

## 📦 Features

- Interactive CLI using `readline`
- Fetch coordinates by ZIP code
- Get real-time temperature (in Fahrenheit)
- Clean and user-friendly experience

---

## 🧰 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- Internet connection (for API calls)

---

## 🚀 How to Run

1. Clone the repository or copy the code into a `.js` file (e.g. `weather.js`):

```bash
git clone https://github.com/your-username/weather-fetcher-cli.git
cd weather-fetcher-cli
Run the script:
```

node weather.js
Follow the on-screen prompts to enter a ZIP code and view the weather.

## 🔍 Example

```css
Welcome to Weather Fetcher
1. Display weather by Zipcode
2. Exit
Please choose a menu item: 1
Please type your zip code (5 digit): 60601

Current weather in Chicago, Illinois is 78.6 °F
Exiting...
```

## 📡 APIs Used

Zippopotam.us - For location details based on ZIP code

Open-Meteo - For current temperature data

## 🧠 Fun Fact

This is a great starter project if you're learning about:

Asynchronous programming in JavaScript (async/await)

Working with REST APIs

Building command-line tools with Node.js

## 📌 Notes

Make sure you’re connected to the internet before running the script.

If you enter an invalid ZIP code, you'll be prompted to try again.

## 🛠️ To-Do (for future improvements)

Add weather forecasts (hourly/daily)

Support non-US ZIP/postal codes

Add option to display temperature in Celsius

Add unit tests

### 👨‍💻 Author

Evan A.

📄 License
This project is licensed under the MIT License.
