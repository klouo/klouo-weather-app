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

function displayForecast(){
  let forecastElement = document.querySelector("#forecast");
  let days = ["Thu", "Fri", "Sat", "Sun"];

  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
  forecastHTML = forecastHTML + 
  `
  <div class="col-2">
    <strong><div class="ahead-day">${day}</div></strong>
    <img
      src="http://openweathermap.org/img/wn/50d@2x.png"
      alt=""
      width="42"
    />
    <div class="weather-forecast-temperatures">
      <span class="ahead-low"> 12° </span>
      <span class="ahead-high"> 17° </span>
    </div>
  </div>
`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML; 
  console.log(forecastHTML);
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
  document.querySelector("#current-low").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#current-high").innerHTML = Math.round(
    response.data.main.temp_max
  );
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  celsiusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function searchCity(cityInput) {
let units = "metric";
let apiKey = "f8f0c9241ff771e67ddebb64996017c7";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
let apiUrl = `${apiEndpoint}?q=${cityInput}&appid=${apiKey}&units=${units}`;
axios.get(apiUrl).then(showWeather);
}

function locationSearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input").value;
  searchCity(cityInput);
}

function updateWeather(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiKey = "f8f0c9241ff771e67ddebb64996017c7";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

function retrievePosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(updateWeather);
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

searchCity("Queenstown");
displayForecast();