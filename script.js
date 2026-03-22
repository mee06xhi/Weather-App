const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-button");
const weatherResult = document.getElementById("weather-info");
const celsiusBtn = document.getElementById("celsius-button");
const fahrenheitBtn = document.getElementById("fahrenheit-button");

const API_KEY="a0651c8650e687a927f3699b8ba17e18";

let weatherdata= null;
let currentUnit= "C";

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim(); 
    if (city=="") {
        weatherResult.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    getWeather(city);
});

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

celsiusBtn.addEventListener("click", () => {
    currentUnit= "C";
    toggleActive("celsius-button");
    renderWeather();
});

fahrenheitBtn.addEventListener("click", () => {
    currentUnit= "F";
    toggleActive("fahrenheit-button");
    renderWeather();
});

async function getWeather(city) {
    weatherResult.innerHTML = "<p>Loading...</p>";
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error("City not found!");
        }
        const data = await response.json();

        displayWeather(data);
    } catch (error) {
        weatherResult.innerHTML = `<p>City not found!</p>`;
    }
}

function renderWeather() {
    if (!weatherdata) return;

    let temp = weatherdata.main.temp;
    let unitSymbol = "°C";

    if (currentUnit === "F") {
        temp = (temp * 9/5) + 32;
        unitSymbol = "°F";
    }
    weatherResult.innerHTML = `
        <h2>Weather in ${weatherdata.name}</h2>
        <p class="weather-icon">${getCustomIcon(weatherdata.weather[0].main)}</p>
        <p>Temperature: ${temp.toFixed(2)} ${unitSymbol}</p>
        <p>Humidity: ${weatherdata.main.humidity}%</p>
        <p>Condition: ${weatherdata.weather[0].description}</p>
        <p>Wind Speed: ${weatherdata.wind.speed} m/s</p>
    `;
}

function displayWeather(data) {
    weatherdata = data;
    updateBackground(data.weather[0].main);
    renderWeather();
}

function toggleActive(activeBtn) {
    celsiusBtn.classList.remove("active");
    fahrenheitBtn.classList.remove("active");
    document.getElementById(activeBtn).classList.add("active");

    const slider=document.querySelector(".slider");
    if (activeBtn==="fahrenheit-button") {
        slider.style.transform="translateX(calc(100% + 4px))";
    } else {
        slider.style.transform="translateX(0%)";
    }
}

function updateBackground(weatherMain) {
    document.body.className = ""; // reset
    document.body.classList.add(weatherMain.toLowerCase());
}

function getCustomIcon(weatherMain) {
    switch (weatherMain.toLowerCase()) {
        case "clear": return "☀️";
        case "clouds": return "☁️";
        case "snow": return "❄️";
        case "thunderstorm": return "⛈️";
        case "rain": return "🌧️";
        case "drizzle": return "🌦️";
        case "haze":
        case "mist":
        case "fog": return "🌫️";
        default: return "🌡️";
    }
}



