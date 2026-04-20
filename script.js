const API_KEY = "Your API_KEY"; // Replace with your API key
const cities = [
  { name: "New Delhi", country: "INDIA" },
  { name: "Washington", country: "USA" },
  { name: "Berlin", country: "GERMANY" },
  { name: "London", country: "UK" },
  { name: "Paris", country: "FRANCE" },
  { name: "Masco", country: "RUSSIA" },
  { name: "Tokyo", country: "JAPAN" },
  { name: "Doha", country: "QATAR" },
  { name: "Beijing", country: "CHINA" }
];

const countryNames = {
  IN: "India",
  US: "United States",
  DE: "Germany",
  GB: "United Kingdom",
  FR: "France",
  LR: "Russia",
  JP: "Japan",
  QA: "Qatar",
  CN: "China"
};

window.onload = () => {
  fetchWeatherForCities();
};

function fetchWeatherForCities() {
  const weatherContainer = document.getElementById("weather-result");
  weatherContainer.innerHTML = "";

  const weatherDataList = [];

  const fetchPromises = cities.map((cityObj, index) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityObj.name)},${cityObj.country}&appid=${API_KEY}&units=metric`;

    return fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`${cityObj.name} not found`);
        return response.json();
      })
      .then((data) => {
        weatherDataList[index] = generateWeatherHTML(data);
      })
      .catch((error) => {
        weatherDataList[index] = `<p>${error.message}</p>`;
      });
  });

  Promise.all(fetchPromises).then(() => {
    weatherDataList.forEach((weatherHTML) => {
      weatherContainer.innerHTML += weatherHTML;
    });
  });
}


function generateWeatherHTML(data) {
  const utcTime = Date.now(); 
  const localTime = new Date(utcTime + data.timezone * 1000); 

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = days[localTime.getUTCDay()];
  const dd = String(localTime.getUTCDate()).padStart(2, '0');
  const mm = String(localTime.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = localTime.getUTCFullYear();

  const time = localTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  });

  const formattedDateTime = `${day}, ${dd}-${mm}-${yyyy} | ${time}`;
  const countryCode = data.sys.country;
  const countryName = countryNames[countryCode] || countryCode;

  return `
    <div class="city-weather">
      <div class="country-header">
        <img src="https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png" alt="${countryName} flag" style="vertical-align:middle; margin-right:8px;"/>
        <span style="font-weight: bold; font-size: 18px;">${countryName}</span>
      </div>
      <h2 class="city-name" style="margin-top: 5px;">${data.name}</h2>
      
      <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon"/>
      <p class="description" style="text-transform: capitalize;">${data.weather[0].description}</p>
      
      <p style="margin: 6px 0 10px 0;">🗓️ ${formattedDateTime}</p>
      
      <p>🌡️ Temperature: ${data.main.temp}°C</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
      <p>🌡️ Pressure: ${data.main.pressure} hPa</p>
      <hr/>
    </div>
  `;
}







