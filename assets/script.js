const APIKey = "23d272a09ce577ff8776ec8c3049893b";
const searchFormEl = document.querySelector("#user-form");

let cityInput = document.getElementById("city");

let todayWeatherContainerEl = document.getElementById("today-weather");
let forecastContainerEl = document.getElementById("weather-container");



// inside search function: let city = document.getElementById("city").value;
// want to make sure that city can be both the id from the search and also later, the value from a new id

/* 
Step one: Collect search query from user and request data from API: 
- Weather icon (cloudy etc)
- temperature
- Wind
- Humidity
- UV Index

Other important data: Today's date, city name in H2
Currently holding today's date in a <span> but that might need to be done in js

All of these things in a card/hero in the top row of the right side column
*/


let formSubmitHandler = function (event) {
    event.preventDefault();

    let cityName = cityInput.value.trim();

    if (cityName) {
        getCurrentWeather(cityName);

    } else {
        alert('Please enter a city name');
    }
}

let getCurrentWeather = function (city) {
    let cityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey;
    let coordinates;
    let latLonData;

    fetch(cityURL)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    latLonData = data;
                    console.log(latLonData);

                    let latitude = data[0].lat;
                    let longitude = data[0].lon;
                    coordinates = "lat=" + latitude + "&lon=" + longitude;

                    return fetch("https://api.openweathermap.org/data/2.5/onecall?" + coordinates + "&exclude=minutely,hourly,daily,alerts" + "&appid=" + APIKey + "&units=imperial")
                        .then(function (response) {
                            if (response.ok) {
                                // console.log(response);
                                response.json().then(function (data) {
                                    // console.log(data);
                                    displayWeather(data, city);
                                })
                            } else {
                                alert('Error: ' + response.statusText);
                            }
                        })
                        .catch(function (error) {
                            alert('Unable to connect to OpenWeather');
                        });

                })
            }
        })
}

/*
let getCurrentWeather = function (city) {
 
    // let queryURL = "https://api.openweathermap.org/data/2.5/onecall?q=" + coordinates + "&cnt=5" + "&appid=" + APIKey + "&units=imperial";
 
    let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
 
    fetch("https://api.openweathermap.org/data/2.5/onecall?q=" + coordinates + "&cnt=5" + "&appid=" + APIKey + "&units=imperial")
        .then(function (response) {
            if (response.ok) {
                // console.log(response);
                response.json().then(function (data) {
                    // console.log(data);
                    displayWeather(data, city);
                })
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather');
        });
 
}
*/
let getForecast = function (city) {
    let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=5" + "&appid=" + APIKey + "&units=imperial";

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                // console.log(response);
                response.json().then(function (data) {
                    // console.log(data);
                    displayForecast(data, city);
                })
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather');
        });
}

let displayWeather = function (data, cityName) {
    if (data.length === 0) {
        alert('No weather data found');
        return;
    }

    let currentCity = document.getElementById("current-city");
    let cityHeading = document.createElement('h2');
    let currentDay = moment().format("DD/MM/YYYY");

    let iconCode = data.current.weather.icon;
    let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";


    let iconEl = document.createElement('img');
    iconEl.setAttribute('src', iconURL);

    let weatherIcon = iconEl;

    cityHeading.innerHTML = cityName + ", " + currentDay;
    cityHeading.appendChild(weatherIcon);
    currentCity.appendChild(cityHeading);

    let currentTemp = $("#current-temp");
    let currentHumidity = $("#current-humidity");
    let currentWind = $("#current-wind");
    let currentUv = $("#current-uv");

    currentTemp.replaceWith(data.current.temp);
    currentUv.replaceWith(data.current.uvi);
    currentHumidity.replaceWith(data.current.humidity);
    currentWind.replaceWith(data.current.wind_speed);

}

searchFormEl.addEventListener('submit', formSubmitHandler);


/*
Step two: Get next five days' forecast for bottom row of right side column
- Date
- Weather icon (cloudy etc)
- temperature
- Wind
- Humidity
- UV Index
*/




/*
Step three: Store previous searches in list below search form in left-hand column
*/

/*
Step four: Reconstitute previous searches in right-hand column 
    when previous search buttons/list items are clicked
  */

// Adds previous searches to sidebar list
let searchList = document.querySelector("#searches");
let cities = [];

function listCities() {

    searchList.innerHTML = "";

    for (var i = 0; i < cities.length; i++) {
        let prevCity = cities[i];


        // This will need to be fixed: I don't want to just make them links, I want them to run their searches
        let a = document.createElement('a');
        a.href = "";


        let list = document.createElement("li");
        list.textContent = prevCity;
        list.setAttribute("data-index", i);

        a.appendChild(list)
        searchList.appendChild(a);
    }
}

function init() {
    let storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {
        cities = storedCities;
    }
    listCities();
}

function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

searchFormEl.addEventListener("submit", function (event) {
    event.preventDefault();
    let cityText = cityInput.value.trim();
    if (cityText === "") {
        return;
    }
    cities.push(cityText);
    cityInput.value = '';
    storeCities();
    listCities();
});

searchList.addEventListener("click", function (event) {
    let element = event.target;
    if (element.matches("button") === true) {
        let index = element.parentElement.getAttribute("data-index");
        cities.splice(index, 1);
        storeCities();
        listCities();
    }
})

init();
