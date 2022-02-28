function formatDate(timestamp) {
let date = new Date(timestamp);
let hours = date.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = date.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let day = days[date.getDay()];
return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) 
   {
    if (index < 6) {
  forecastHTML = forecastHTML + 
  `
  <div class="col-2">
    <strong><div class="ahead-day">${formatDay(forecastDay.dt)}</div></strong>
    <img
      src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
      alt=""
      width="50"
    />
    <div class="weather-forecast-temperatures">
      <span class="ahead-low">${Math.round(forecastDay.temp.min)}°</span>
      <span class="ahead-high">${Math.round(forecastDay.temp.max)}° </span>
    </div>
  </div>
`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML; 
  console.log(forecastHTML);
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function sunriseTime(response) {
  let sunriseElement = document.querySelector("#sunrise");
  let sunriseTime = new Date(response.data.sys.sunrise * 1000);
  let sunriseHour = sunriseTime.getHours();
  let sunriseMinute = sunriseTime.getMinutes();
  if (sunriseMinute < 10) {
    sunriseMinute = `0${sunriseMinute}`;
  }
  if (sunriseHour < 10) {
    sunriseHour = `0${sunriseHour}`;
  }
  sunriseElement.innerHTML = `<strong>Sunrise: </strong>${sunriseHour}:${sunriseMinute}am`;
}
function sunsetTime(response) {
  let sunsetElement = document.querySelector("#sunset");
  let sunsetTime = new Date(response.data.sys.sunset * 1000);
  let sunsetHour = sunsetTime.getHours();
  let sunsetMinute = sunsetTime.getMinutes();
  if (sunsetMinute < 10) {
    sunsetMinute = `0${sunsetMinute}`;
  }
  if (sunsetHour < 10) {
    sunsetHour = `0${sunsetHour}`;
  }
  sunsetElement.innerHTML = `<strong>Sunset: </strong>${sunsetHour}:${sunsetMinute}pm`;
}

function showWeather(response) {
  console.log(response);
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    celsiusTemperature
  );
  document.querySelector("#weather-type").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
 
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  celsiusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  getForecast(response.data.coord);
}

function searchCity(cityInput) {
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
let apiUrl = `${apiEndpoint}?q=${cityInput}&appid=${apiKey}&units=${units}`;
axios.get(apiUrl).then(showWeather);
axios.get(apiUrl).then(sunriseTime);
axios.get(apiUrl).then(sunsetTime);
}

function showLocation(position) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
  axios.get(apiUrl).then(sunriseTime);
  axios.get(apiUrl).then(sunsetTime);
}

function retrievePosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showLocation);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function locationSearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input").value;
  searchCity(cityInput);
}

let apiKey = "f8f0c9241ff771e67ddebb64996017c7";
let units = "metric";
let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);

let currentLocation = document.querySelector("#current-location-button");
currentLocation.addEventListener("click", retrievePosition);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", locationSearch);

let iconElement = document.querySelector("#icon");
let temperatureElement = document.querySelector("#temperature");
let dateElement = document.querySelector("#date");

searchCity("Nelson");