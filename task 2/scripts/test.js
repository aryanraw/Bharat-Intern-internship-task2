async function fetchUrl(url) {
    try {
      const response = await fetch(url);
  
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
      } else {
        throw new Error("Unable to find the location");
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  document.getElementById('search-button').addEventListener('click', function () {
    const city = document.getElementById('city-input').value;
    console.log(city);
    getWeatherData(city);
});
  
  const apiKey = 'e0a910cf9f2a35b506f136dacc4f145f';
  const apiurlforcoords = 'https://api.openweathermap.org/data/2.5/weather';
  const forecastUrl = 'https://api.openweathermap.org/data/3.0/onecall';
  let unitSystem = 'metric';
  // Create an async function to call fetchUrl and log the result
  async function getWeatherData(city) {
    try {
      const data = await fetchUrl(`${apiurlforcoords}?q=${city}&appid=${apiKey}&units=${unitSystem}`);
      console.log('Weather data:', data);
  
      if (data && data.coord) {
        const coords = {
          lat: data.coord.lat,
          lon: data.coord.lon,
          cityname: data.name,
          description: data.weather[0].description
        };

        console.log('Name from the Json:'+ coords.cityname);
        console.log('description from the json:'+ coords.description);
        console.log('Coordinates:', coords);
  
        const forecastURL = `${forecastUrl}?lat=${coords.lat}&lon=${coords.lon}&exclude=minutely,alerts&units=${unitSystem}&appid=${apiKey}`;
        const data2 = await fetchUrl(forecastURL);
        console.log('Forecast data:', data2);
        updateWeatherUI(data2, coords.cityname, coords.description);
        updateForecastUI(data2)
        updateHourlyUI(data2)
      } else {
        throw new Error('Coordinates are missing in the weather data');
      }
    } catch (err) {
      console.error('Error:', err); // Log any errors that occur
    }
  }

function updateWeatherUI(data, city, description) {
    console.log(description);
    let des = description
    console.log(des)
    const logo = document.getElementById('current-icon');
    logo.innerHTML = '';
    const icon = document.createElement('img');
    icon.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
    logo.appendChild(icon);
    document.getElementById('city-name').textContent = city;
    document.getElementById('current-desciption').innerText = des;
    document.getElementById('current-temp').textContent = Math.round(data.current.temp)+'°C';
    document.getElementById('feels-like').textContent = Math.round(data.current.feels_like)+'°C';
    document.getElementById('wind-speed').textContent = data.current.wind_speed+'km/h';
    document.getElementById('uv-index').textContent = data.current.uvi;
    document.getElementById('humidity').textContent = data.current.humidity+'%';
}

function updateHourlyUI(data) {
  const hourlyForecast = document.getElementById('hourly-forecast');
  hourlyForecast.innerHTML = '';
  data.hourly.slice(0, 24).forEach(hour => {
      const hourElement = document.createElement('div');
      hourElement.className = 'forecast-item';
      hourElement.innerHTML = `
          <div>${new Date(hour.dt * 1000).getHours()}:00</div>
          <div><img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="${hour.weather[0].description}"></div>
          <div>${Math.round(hour.temp)}°C</div>
      `;
      console.log(hour.weather[0].icon)
      hourlyForecast.appendChild(hourElement);
  });
}

function updateForecastUI(data) {
  const weeklyForecast = document.getElementById('weekly-forecast');
  weeklyForecast.innerHTML = '';
  data.daily.slice(1, 8).forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.className = 'forecast-item';
      dayElement.innerHTML = `
          <div>${new Date(day.dt * 1000).toLocaleDateString('en', { weekday: 'short' })}</div>
          <div><img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}"></div>
          <div>Max/Min: ${Math.round(day.temp.max)}°/${Math.round(day.temp.min)}°</div>
          <div>Humidity: ${day.humidity}%</div>
          <div>Pressure: ${day.pressure} hPa</div>
          <div>Wind: ${day.wind_speed} km/h</div>
          <div>UV Index: ${day.uvi}</div>
      `;
      weeklyForecast.appendChild(dayElement);
  });
}