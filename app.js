const search = document.getElementById("searchId");
const form = document.querySelector(".search_area");

const cityNameEl = document.querySelector(".city-name");
const exactTimeEl = document.querySelector(".exact-time");
const dayElement = document.querySelector(".day");

const temperatureFactEl = document.querySelector(".temperature-fact");
const temperatureFeelsLikeEl = document.querySelector(
  ".temperature-feels-like"
);

const weatherActualImgEl = document.querySelector(".weather-actual-img");
const weatherDescriotionEl = document.querySelector(".weather-actual");

const sunriseTimeEl = document.querySelector(".sunrise-time");
const sunsetTimeEl = document.querySelector(".sunset-time");

const humidityEl = document.querySelector(".humidity-percentage");
const windSpeedEl = document.querySelector(".wind-speed");
const pressureEl = document.querySelector(".pressure-data");
const uvEL = document.querySelector(".UV-ones");

const API_KEY_ninja = "a7BPZGvL9Yr6GAkvhGOjBQ==hRuMEnPrbcbI6dKN";
const API_KEY_openWeather = "1dc19de9fa72af0cf1e115ae9bdb43c0";

async function getWeatherInfo(lat, lon) {
  try {
    const weatherInfo = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_openWeather}`
    );

    const weatherData = await weatherInfo.json();
    return weatherData;
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function getUV(lat, lon) {
  try {
    const UV = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY_openWeather}`
    );

    const uvData = await UV.json();
    return uvData;
  } catch {
    console.log("error");
  }
}

async function getLatLon(search_value) {
  try {
    const latLon = await fetch(
      `https://geocode.maps.co/search?q=${search_value}&api_key=67236d1d4feea829367464ivt43a4cb`
    );

    const latLonData = await latLon.json();

    if (latLonData[0]) {
      const { lat, lon } = latLonData[0];
      return { lat, lon };
    } else {
      console.log("Array is empty");
    }
  } catch (error) {
    console.log(error);
  }
}

async function getCityTime(lat, lon) {
  const city = await fetch(
    `https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lon}`,
    {
      method: "GET",
      headers: {
        "X-Api-Key": API_KEY_ninja,
      },
    }
  );

  const cityTimeData = await city.json();
  const { hour, minute, day_of_week, day, month } = cityTimeData;
  return { hour, minute, day_of_week, day, month };
}

function getWatherPicture(weatherID) {
  if (weatherID === 800 || weatherID === 801) {
    return "assets/icons/forecast_icns/clear 2.svg";
  } else if (weatherID >= 802 && weatherID <= 804) {
    return "assets/icons/forecast_icns/clouds 1.svg";
  } else if (weatherID >= 300 && weatherID <= 321) {
    return "assets/icons/forecast_icns/drizzle 1.svg";
  } else if (weatherID === 701) {
    return "assets/icons/forecast_icns/mist 1.svg";
  } else if (weatherID >= 500 && weatherID <= 531) {
    return "assets/icons/forecast_icns/rain 1.svg";
  } else if (weatherID >= 600 && weatherID <= 622) {
    return "assets/icons/forecast_icns/snow.svg";
  }
}

function getCapitalizedText(text, words) {
  const cutText = text.split(" ").slice(0, words).join(" ").trim();
  const capitalizedText = cutText.charAt(0).toUpperCase() + cutText.slice(1);
  return capitalizedText;
}

function getMonthName(date) {
  switch (date) {
    case "01":
      return "Jan";
    case "02":
      return "Feb";
    case "03":
      return "Mar";
    case "04":
      return "Apr";
    case "05":
      return "May";
    case "06":
      return "June";
    case "07":
      return "July";
    case "08":
      return "Aug";
    case "09":
      return "Sep";
    case "10":
      return "Oct";
    case "11":
      return "Nov";
    case "12":
      return "Dec";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  //Get lat, lon from the function
  const { lat, lon } = await getLatLon(search.value);
  const timeData = await getCityTime(lat, lon);
  const weatherData = await getWeatherInfo(lat, lon);
  const uvData = await getUV(lat, lon);

  const { value: UV } = uvData;

  //Destucted data getting assigned by returned from the function getWeatherInfo()
  const {
    main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
  } = weatherData;

  const idWeather = weatherData.weather[0].id;
  const weatherDescription = weatherData.weather[0].description;

  const {
    sys: { type, id, country, sunrise, sunset },
  } = weatherData;

  //Destructed datas getting assigned by returned data from the function getCityTime()
  const { hour, minute, day_of_week, day, month } = timeData;

  //Actual Weather Img
  weatherActualImgEl.src = getWatherPicture(idWeather);

  weatherDescriotionEl.textContent = getCapitalizedText(weatherDescription, 2)

  //City name assigned
  cityNameEl.textContent = getCapitalizedText(search.value, 1);

  //City time and date assigned
  exactTimeEl.textContent = `${hour}:${minute.toString().padStart(2, "0")}`;
  dayElement.textContent = `${day_of_week}, ${day} ${getMonthName(month)}`;

  //Temp calculating and loading
  const celsiumFact = temp - 273.15;
  const celsiumFeelsLike = feels_like - 273.15;
  temperatureFactEl.textContent = `${celsiumFact.toFixed(0)}°C`;
  temperatureFeelsLikeEl.textContent = `Feels like: ${celsiumFeelsLike.toFixed(
    0
  )}°C!!`;

  //Wind speed
  windSpeedEl.textContent = `${weatherData.wind.speed}km/h`;
  humidityEl.textContent = `${humidity}%`;

  //Pressure & UV
  pressureEl.textContent = `${pressure.toFixed(0)}hPa`;
  uvEL.textContent = `${UV.toFixed(2)}`;

  const sunsetDate = new Date(sunset * 1000);
  const sunriseDate = new Date(sunrise * 1000);

  //Sunset & Sunrise data loaded
  sunriseTimeEl.textContent = `${sunriseDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${sunriseDate
    .getMinutes()
    .toString()
    .padStart(2, "0")} AM`;

  sunsetTimeEl.textContent = `${sunsetDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${sunsetDate
    .getMinutes()
    .toString()
    .padStart(2, "0")} PM`;
});
