import { DateTime } from "./node_modules/luxon/src/luxon.js";

const search = document.getElementById("searchId");
const form = document.querySelector(".search_area");

const cityNameEl = document.querySelector(".city-name");
const exactTimeEl = document.querySelector(".exact-time");
const dayElement = document.querySelector(".day");

const temperatureFactEl = document.querySelector(".temperature-fact");

const temperatureFeelsLikeEl = document.querySelector(".feels-like-grad");
const tempFeelsLikeTextEl = document.querySelector(".temperature-feels-like");
const tempDataBox = document.querySelector(".temp-data");

const weatherActualImgEl = document.querySelector(".weather-actual-img");
const weatherDescriotionEl = document.querySelector(".weather-actual");

const sunriseTimeEl = document.querySelector(".sunrise-time");
const sunsetTimeEl = document.querySelector(".sunset-time");

const humidityEl = document.querySelector(".humidity-percentage");
const windSpeedEl = document.querySelector(".wind-speed");
const pressureEl = document.querySelector(".pressure-data");
const uvEL = document.querySelector(".UV-ones");

const daysTemp = document.querySelectorAll(".grad");
const forecastDateDays = document.querySelectorAll(".forecast-date");

const containerTimeEL = document.querySelector(".container-time");
const containerWeatherDataEL = document.querySelector(
  ".container-weather-data"
);
const containerDaysForecastEL = document.querySelector(
  ".container-5days-forecast"
);

const API_KEY_ninja = "a7BPZGvL9Yr6GAkvhGOjBQ==hRuMEnPrbcbI6dKN";
const API_KEY_openWeather = "1dc19de9fa72af0cf1e115ae9bdb43c0";
const API_KEY_appweather = "DapE5AYd9qvom9bN1f164cnzFGkFLNxG";

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

async function getFiveDaysForecast(lat, lon) {
  const locationIDResponse = await fetch(
    `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY_appweather}&q=${lat},${lon}`
  );

  const locationData = await locationIDResponse.json();
  const locationKey = await locationData.Key;

  const forecastResponse = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${API_KEY_appweather}`
  );

  const forecastData = await forecastResponse.json();
  const dailyForecast = await forecastData.DailyForecasts;

  const FiveDaysForecast = {};

  console.log(dailyForecast);

  dailyForecast.forEach((day, index) => {
    const maxF = day.Temperature.Maximum.Value;
    const minF = day.Temperature.Minimum.Value;
    const dateInfo = day.Date;

    const maxC = ((maxF - 32) * 5) / 9;
    const minC = ((minF - 32) * 5) / 9;

    const averageC = (maxC + minC) / 2;

    FiveDaysForecast[`Day${index + 1}`] = {
      averageTemperature: averageC.toFixed(0),
      date: dateInfo,
    };
  });

  return FiveDaysForecast;
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

// function LoadingSimulation() {
//   const containerTimeChilden = containerTimeEL.children;
//   const containerWeatherDataChildren = containerWeatherDataEL.children;
//   const containerDaysForecastChildren = containerDaysForecastEL.children;

//   hideElements(containerTimeChilden);
//   hideElements(containerWeatherDataChildren);
//   hideElements(containerDaysForecastChildren);


//   setTimeout(() => {
//     showElements(containerTimeChilden);
//     showElements(containerWeatherDataChildren);
//     showElements(containerDaysForecastChildren);
//   }, 1000);
// }

function hideElements(children) {
  Array.from(children).forEach((child) => (child.style.display = "none"));
}


function showElements(children) {
  Array.from(children).forEach((child) => (child.style.display = "block")); // Или "inline", если необходимо
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

function toNormalDate(date, element) {
  const isoDate = DateTime.fromISO(date);

  const fullDate = isoDate.toLocaleString(DateTime.DATE_FULL);

  console.log(isoDate.weekdayLong);

  if (isoDate.weekdayLong.length > 6) {
    element.style.fontSize = "16px";
  }

  return `${isoDate.weekdayLong}, ${isoDate.toFormat("dd LLL")}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();



    const { lat, lon } = await getLatLon(search.value);
    const timeData = await getCityTime(lat, lon);
    const weatherData = await getWeatherInfo(lat, lon);
    const uvData = await getUV(lat, lon);
    const { value: UV } = uvData;
    const { hour, minute, day_of_week, day, month } = timeData;
    const {
      main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
    } = weatherData;
    const {
      sys: { type, id, country, sunrise, sunset },
    } = weatherData;
    const { timezone } = weatherData;

    const idWeather = weatherData.weather[0].id;
    const weatherDescription = weatherData.weather[0].description;

    const [day1, day2, day3, day4, day5] = [...daysTemp];
    const [
      day1ForecastEL,
      day2ForecastEL,
      day3ForecastEL,
      day4ForecastEL,
      day5ForecastEL,
    ] = forecastDateDays;

    const forecast = await getFiveDaysForecast(lat, lon);

    day1ForecastEL.textContent = toNormalDate(
      forecast.Day1.date,
      day1ForecastEL
    );
    day2ForecastEL.textContent = toNormalDate(
      forecast.Day2.date,
      day2ForecastEL
    );
    day3ForecastEL.textContent = toNormalDate(
      forecast.Day3.date,
      day3ForecastEL
    );
    day4ForecastEL.textContent = toNormalDate(
      forecast.Day4.date,
      day4ForecastEL
    );
    day5ForecastEL.textContent = toNormalDate(
      forecast.Day5.date,
      day5ForecastEL
    );

    day1.textContent = `${forecast.Day1.averageTemperature}°C`;
    day2.textContent = `${forecast.Day2.averageTemperature}°C`;
    day3.textContent = `${forecast.Day3.averageTemperature}°C`;
    day4.textContent = `${forecast.Day4.averageTemperature}°C`;
    day5.textContent = `${forecast.Day5.averageTemperature}°C`;

    //Actual Weather Img
    weatherActualImgEl.src = getWatherPicture(idWeather);
    weatherDescriotionEl.textContent = getCapitalizedText(
      weatherDescription,
      2
    );

    //City name assigned
    cityNameEl.textContent = getCapitalizedText(search.value, 1);

    //City time and date assigned
    exactTimeEl.textContent = `${hour}:${minute.toString().padStart(2, "0")}`;
    dayElement.textContent = `${day_of_week}, ${day} ${getMonthName(month)}`;

    //Temp calculating and loading
    const celsiumFact = temp - 273.15;
    const celsiumFeelsLike = feels_like - 273.15;
    temperatureFactEl.textContent = `${celsiumFact.toFixed(0)}°C`;

    if (celsiumFeelsLike < 0) {
      temperatureFeelsLikeEl.textContent = `${celsiumFeelsLike.toFixed(0)}°C`;
      tempFeelsLikeTextEl.style.justifySelf = "flex-center";
      temperatureFeelsLikeEl.style.justifySelf = "flex-start";
      tempDataBox.style.gap = "5px";
    } else {
      tempDataBox.style.gap = "5px";
    }

    //Wind speed
    windSpeedEl.textContent = `${weatherData.wind.speed}km/h`;
    humidityEl.textContent = `${humidity}%`;

    //Pressure & UV
    pressureEl.textContent = `${pressure.toFixed(0)}hPa`;
    uvEL.textContent = `${UV.toFixed(2)}`;

    const sunriseDate = DateTime.fromSeconds(sunrise, {
      zone: `UTC+${timezone / 3600}`,
    });
    const sunsetDate = DateTime.fromSeconds(sunset, {
      zone: `UTC+${timezone / 3600}`,
    });
    const formatedSunrise = sunriseDate.toFormat(`HH:mm`);
    const formatedSunset = sunsetDate.toFormat("HH:mm");

    sunriseTimeEl.textContent = formatedSunrise;

    sunsetTimeEl.textContent = formatedSunset;

  
});
