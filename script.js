const apiKey = '1d5d8df6080946c71c15dbdee154d0d4'; 
const apiURL = 'https://api.openweathermap.org/data/2.5/weather';
const hourlyAPIURL = 'https://api.openweathermap.org/data/2.5/onecall';

document.getElementById('search-button').addEventListener('click', getWeatherData);

async function getWeatherData() {
  const city = document.getElementById('city').value;

  if (!city) {
    alert('Please enter a city');
    return;
  }

  const weatherResponse = await fetch(`${apiURL}?q=${city}&appid=${apiKey}&units=metric`);
  const weatherData = await weatherResponse.json();

  if (weatherData.cod === '404') {
    alert('City not found');
    return;
  }

  displayWeather(weatherData);
  getHourlyForecast(weatherData.coord.lat, weatherData.coord.lon);
}

function displayWeather(weatherData) {
  document.getElementById('temperature').innerText = `${weatherData.main.temp}°C`;
  document.getElementById('weather-description').innerText = weatherData.weather[0].description;
  document.getElementById('weather-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="weather icon" />`;
}

async function getHourlyForecast(lat, lon) {
  const hourlyResponse = await fetch(`${hourlyAPIURL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
  const hourlyData = await hourlyResponse.json();
  
  const hourlyForecast = hourlyData.hourly.slice(0, 6); // Show next 6 hours
  const hourlyContainer = document.getElementById('hourly');
  hourlyContainer.innerHTML = '';

  hourlyForecast.forEach(hour => {
    const hourCard = document.createElement('div');
    hourCard.classList.add('p-4', 'bg-white', 'rounded-lg', 'shadow-md', 'text-center', 'text-gray-700', 'dark:text-white');
    
    const time = new Date(hour.dt * 1000).getHours();
    const temp = hour.temp;

    hourCard.innerHTML = `
      <div>${time}:00</div>
      <div>${temp}°C</div>
      <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" alt="weather icon" />
    `;

    hourlyContainer.appendChild(hourCard);
  });

  document.getElementById('hourly-forecast').classList.remove('hidden');
}

// Dark/Light Mode Toggle
document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
