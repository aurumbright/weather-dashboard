let city;
let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

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