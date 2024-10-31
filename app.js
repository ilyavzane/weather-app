const search = document.getElementById("searchId");
const form = document.querySelector(".search_area");

const cityNameEl = document.querySelector(".city-name");
const exactTimeEl = document.querySelector(".exact-time");
const dayElement = document.querySelector(".day");

const temperatureFactEl = document.querySelector(".temperature-fact");
const temperatureFeelsLikeEl = document.querySelector(
  ".temperature-feels-like"
);
const sunriseTimeEl = document.querySelector(".sunrise-time");
const sunsetTimeEl = document.querySelector(".sunset-time");

const humidityEl = document.querySelector(".humidity-percentage");
const windSpeedEl = document.querySelector(".wind-speed");




const API_KEY_ninja = "a7BPZGvL9Yr6GAkvhGOjBQ==hRuMEnPrbcbI6dKN";

async function getWeatherInfo(lat, lon) {
  try {
    const weatherInfo = await fetch(
      `https://api.api-ninjas.com/v1/weather?lat=${lat}&lon=${lon}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": API_KEY_ninja,
        },
      }
    );

    const weatherData = await weatherInfo.json();
    return weatherData;
  } catch (error) {
    console.log("Error: ", error);
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
  //Get time from the function
  const timeData = await getCityTime(lat, lon);

  //Destructed datas getting assigned by returned data from the function getCityTime()
  const { hour, minute, day_of_week, day, month } = timeData;

  //City name assigned
  cityNameEl.textContent = search.value;

  //City time and date assigned
  exactTimeEl.textContent = `${hour}:${minute.toString().padStart(2, "0")}`;
  dayElement.textContent = `${day_of_week}, ${day} ${getMonthName(month)}`;

  //Destucted data getting assigned by returned from the function getWeatherInfo()
  const weatherData = await getWeatherInfo(lat, lon);
  const { wind_speed, temp, humidity, sunset, feels_like, sunrise } =
    weatherData;
  temperatureFactEl.textContent = `${temp}°C`;
  temperatureFeelsLikeEl.textContent = `Feels like: ${feels_like}°C`;

  const sunsetDate = new Date(sunset * 1000);
  const sunriseDate = new Date(sunrise * 1000);

  windSpeedEl.textContent = `${wind_speed}%`;
  humidityEl.textContent = `${humidity}%`;

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
