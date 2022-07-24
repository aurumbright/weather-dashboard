const searchFormEl = document.querySelector("#user-form");

let cityInput = document.getElementById("city");

let todayWeatherContainerEl = document.getElementById("today-weather");
let forecastContainerEl = document.getElementById("weather-container");

let dateDisplayEl = $('#current-day');

// finding today's date
let currentDay = moment().format("DD/MM/YYYY");
dateDisplayEl.text(currentDay);

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
    let cityName = cityInput.value.trim()
    if (cityName) {
        getCurrentWeather(cityName);
        // todayWeatherContainerEl.textContent = '';
        getForecast(cityName);
        // forecastContainerEl.textContent = '';
    } else {
        alert('Please enter a city name');
    }
}

let getCurrentWeather = function (city) {
    let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
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

}

let getForecast = function (city) {
    let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=5" + "&appid=" + APIKey;

    fetch(queryURL)
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
}

let displayWeather = function () {

}

/* 

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No repositories found.';
    return;
  }

  repoSearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    var repoName = repos[i].owner.login + '/' + repos[i].name;

    var repoEl = document.createElement('a');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';
    repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};
*/


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
