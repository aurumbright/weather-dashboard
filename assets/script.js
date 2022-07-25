const APIKey = "23d272a09ce577ff8776ec8c3049893b";
const searchFormEl = document.querySelector("#user-form");

let cityInput = document.getElementById("city");

let todayWeatherContainerEl = document.getElementById("today-weather");
let forecastContainerEl = document.getElementById("weather-container");

let formSubmitHandler = function (event) {
    event.preventDefault();

    let cityName = cityInput.value.trim();

    if (cityName) {
        getCurrentWeather(cityName);

    } else {
        alert('Please enter a city name');
    }
}

let getCurrentWeather = function(city) {

    let cityURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey;
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

                    return fetch("https://api.openweathermap.org/data/2.5/onecall?" + coordinates + "&exclude=minutely,hourly" + "&appid=" + APIKey + "&units=imperial")
                        .then(function (response) {
                            if (response.ok) {
                                console.log(response);
                                response.json().then(function (data) {
                                    console.log(data);
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

let displayWeather = function (data, city) {
    if (data.length === 0) {
        alert('No weather data found');
        return;
    }

    let currentCity = document.getElementById("current-city");
    let currentDay = moment().format("DD/MM/YYYY");

    let iconCode = data.current.weather[0].icon;
    let iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";

    let iconEl = document.createElement('img');
    iconEl.setAttribute('src', iconURL);

    let weatherIcon = iconEl;

    currentCity.innerHTML = city + ", " + currentDay;
    currentCity.appendChild(weatherIcon);

    $("#current-temp").text(data.current.temp + '\u00B0' + "F");
    $("#current-humidity").text(data.current.humidity + "%");
    $("#current-wind").text(data.current.wind_speed + "mph");
    $("#current-uv").text(data.current.uvi);


    if (parseInt(data.current.uvi) < 3) {
        $("#uv-alert").attr("class", "alert-success").removeAttr("alert-danger", "alert-warning");
    } else if (parseInt(data.current.uvi) < 7) {
        $("#uv-alert").attr("class", "alert-warning").removeAttr("alert-danger", "alert-success");
    } else if (parseInt(data.current.uvi) > 7) {
        $("#uv-alert").attr("class", "alert-danger").removeAttr("alert-success", "alert-warning");
    };

    // 5-day forecast
    forecastContainerEl.textContent = "";

    for (let i = 1; i < 6; i++) {

        let dayIcon = data.daily[i].weather[0].icon;
        let dayIconURL = "https://openweathermap.org/img/w/" + dayIcon + ".png";

        let weatherContainer = document.getElementById('weather-container');

        let column = document.createElement('div');
        column.setAttribute('class', 'col-sm-2');
        let card = document.createElement('div');
        card.setAttribute('class', 'card');
        let cardBody = document.createElement('div');
        cardBody.setAttribute('class', 'card-body');
        let dayHeading = document.createElement('h5');
        dayHeading.setAttribute('class', 'card-title');

        let dayIconEl = document.createElement('img');
        dayIconEl.setAttribute('class', 'card-text');
        let dayTemp = document.createElement('p');
        dayTemp.setAttribute('class', 'card-text');
        let dayWind = document.createElement('p');
        dayWind.setAttribute('class', 'card-text');
        let dayHumidity = document.createElement('p');
        dayHumidity.setAttribute('class', 'card-text');

        dayHeading.innerText = (moment.unix(data.daily[i].dt).format("DD/MM/YYYY"));
        dayIconEl.setAttribute('src', dayIconURL);
        dayTemp.innerText = "Temperature: " + data.daily[i].temp.day + '\u00B0' + "F";
        dayWind.innerText = "Wind Speed: " + data.daily[i].wind_speed + "mph";
        dayHumidity.innerText = "Humidity: " + data.daily[i].humidity + "%";

        cardBody.append(dayHeading, dayIconEl, dayTemp, dayWind, dayHumidity);
        card.appendChild(cardBody);
        column.appendChild(card);
        weatherContainer.appendChild(column);

    }

}

searchFormEl.addEventListener('submit', formSubmitHandler);

// Adds previous searches to sidebar list
let searchList = document.querySelector("#searches");
let cities = [];

function listCities() {

    searchList.innerHTML = "";

    for (var i = 0; i < cities.length; i++) {
        let prevCity = cities[i];

        let button = document.createElement('button');
        button.setAttribute('class', 'btn-2');

        let list = document.createElement("li");
        list.textContent = prevCity;
        list.setAttribute("data-index", i);

        button.appendChild(list)
        searchList.appendChild(button);
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

let btnClear = document.getElementById('clear');

btnClear.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
});

searchList.addEventListener("click", function (event) {
    let element = event.target;
    if (element.matches("button") === true) {
        let index = element.parentElement.getAttribute("data-index");
        cities.splice(index, 1);
        storeCities();
        listCities();
    }
});

$('#searches').on("click", (event) => {
    event.preventDefault();

    $('.btn-2').val(event.target.textContent);
    prevSearchCity=$('.btn-2').val();
    getCurrentWeather(prevSearchCity);
});

init();
