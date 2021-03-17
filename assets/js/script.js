/* variable to store city searched */
let city;

//city latitude
let cityLat;

//city longitude
let cityLon;

//current date
let today = new Date();
let cityDate = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();

//current weather icon
let cityWeather;


//city temperature
let cityTemp;

/* submit city button */
let searchFormEl = document.querySelector('#searchForm');

/* city input line */
let searchInputEl = document.querySelector('#searchInput');

/* search city history ul for city list item buttons */
let searchULEl = document.querySelector('#searchUL');

/* current city/current day <ul> element in HTML */
let mainCityConditionsEL = document.querySelector('#mainCityConditions');

/* function to make text input the city and call fetch function */
/* also create city button, push info to localStorage */
citySubmitHandler = (event) => {
  event.preventDefault();

  // get value from input element
  city = searchInputEl.value.trim();

  if (city) {
    getCityWeather(city);
    searchInputEl.value = '';
  } else {
    alert("Please enter a valid city.");
  }
};

/* when the page loads check local storage and if there are any
stored cities pass them as parameters for cityConditionsBtn */
$(window).on('load', function () {
  //since you don't know the key names(cities chosen), you gather all the keys 
  //and the value pairs and iterate through them
  key = Object.keys(localStorage),
    i = 0, key;
  //iterate through each key in localStorage 
  for (; key[i]; i++) {
    cityInfo = key[i];
    //take the value of the key and save it in a variable 
    let dataInfo = JSON.parse(localStorage.getItem(key[i]));
    //take out the quotes from the JSON parse() function so 
    //that the btn is not saved in local storage under new key, it replaces instead
    //then passes the city and data as parameters to create the buttons
    cityConditionsBtn(cityInfo.replace(/\"/g, ''), dataInfo);
  }
})

//create btn for city history search
cityConditionsBtn = (city, data) => {
  //create list item for <ul> in HTML
  let cityListItemEl = document.createElement('li');
  //button inside list item
  let cityListBtnEl = document.createElement('button');
  //create classes and set data-name to the city for key in localStorage
  cityListItemEl.classList = 'searchLI col-12';
  cityListItemEl.setAttribute('data-name', city);
  //class and text for button (text is current city name)
  cityListBtnEl.classList = 'cityBtn';
  cityListBtnEl.textContent = city;
  //list item append button
  cityListItemEl.appendChild(cityListBtnEl);
  //<ul> in HTML append list item
  searchULEl.appendChild(cityListItemEl);
  //set the key(current city), value(that city's data) pair for local storage in string form 
  localStorage.setItem(JSON.stringify(city), JSON.stringify(data));
}


/* current city selected function to give weather data */
getCityWeather = (city) => {
  /* store weather api in apiURL variable */
  let apiURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=3d15e45d12f197c35af3d283e17262ae"
  /* request url */
  fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          //creates button 
          cityConditionsBtn(city, data);
          //creates card info for five day 
          fiveDayForecast(city, data);
          //city longitude
          cityLon = data.coord.lon;
          //city latitude
          cityLat = data.coord.lat;
          currentDayForecast(cityLat, cityLon, city);
        })
      } else {
        //alerts if there is an error message when attempting to retrieve api url
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      //connection failure notifications
      alert("Unable to connect to weather data");
    });
}

currentDayForecast = (cityLat, cityLon, city) => {
  //one call api for UV index as well as five day forecast
  let oneAPIURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&exclude=minutely,hourly&appid=3d15e45d12f197c35af3d283e17262ae';

  fetch(oneAPIURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          cityWeather = data.current.weather[0].icon;
          console.log(cityWeather);
          cityTemp = data.current.temp;
          console.log(data)
        })
      } else {
        //alerts if there is an error message when attempting to retrieve api url
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      //connection failure notifications
      alert("Unable to connect to weather data");
    });

  //city name (date in 3/21/2021 format) icon representing current weather conditions
  let cityNameEl = document.createElement('li');
  cityNameEl.classList = 'mainCardLi'
  cityNameEl.setAttribute('id', 'cityNameMain');
  cityNameEl.textContent = city + ' ( ' + cityDate + ' ) ';

  //Temperature: 80.9 F
  let temperatureMainEL = 
  //humidity: 41%
  //wind speed: 4.7mph
  //UV index: colored box indicating severity with format (9.49) inside
  //append to <ul> in the main card
  mainCityConditionsEL.appendChild(cityNameEl)
}

fiveDayForecast = () => {

  //first day
  //second day
  //third day
  //fourth day
  //fifth day
}

searchFormEl.addEventListener("submit", citySubmitHandler);



