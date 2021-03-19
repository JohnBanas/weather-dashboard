/* variable to store city searched */
let city;

//city latitude
let cityLat;

//city longitude
let cityLon;

//current date
let today = new Date();
let cityDate = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();

//five day forecast dates
//first day
let firstDay = today.getMonth() + 1 + '/' + (today.getDate() + 1) + '/' + today.getFullYear();

//second day
let secondDay = today.getMonth() + 1 + '/' + (today.getDate() + 2) + '/' + today.getFullYear();

//third day
let thirdDay = today.getMonth() + 1 + '/' + (today.getDate() + 3) + '/' + today.getFullYear();

//fourth day
let fourthDay = today.getMonth() + 1 + '/' + (today.getDate() + 4) + '/' + today.getFullYear();

//fifth day
let fifthDay = today.getMonth() + 1 + '/' + (today.getDate() + 5) + '/' + today.getFullYear();

//current weather icon
let cityWeather;

//day one weather
let dayOneWeather;

//day two
let dayTwoWeather;

//day three
let dayThreeWeather;

//day four
let dayFourWeather;

//day five
let dayFiveWeather;

//city temperature
let cityTemp;

//history button
let history;

//new history button
let newBtn;

/* submit city button */
let searchFormEl = document.querySelector('#searchForm');

/* city input line */
let searchInputEl = document.querySelector('#searchInput');

/* search city history ul for city list item buttons */
let searchULEl = document.querySelector('#searchUL');

/* current city/current day <ul> element in HTML */
let mainCityConditionsEL = document.querySelector('#mainCityConditions');
/* current city card */
let mainCardEl = document.querySelector('.mainCard')

/* five day heading */
let fiveDayForecastHeadingEl = document.querySelector('.fiveDayForecastHeading')

/* first day card <ul> */
let firstDayULEl = document.querySelector('#firstDay');
/* first day card */
let firstDayCardULEl = document.querySelector('.firstDay');

/* second day card <ul> */
let secondDayULEl = document.querySelector('#secondDay');
/* second day card */
let secondDayCardULEl = document.querySelector('.secondDay');

/* third day card <ul> */
let thirdDayULEl = document.querySelector('#thirdDay');
/* third day card */
let thirdDayCardULEl = document.querySelector('.thirdDay');

/* fourth day card <ul> */
let fourthDayULEl = document.querySelector('#fourthDay');
/* fourth day card */
let fourthDayCardULEl = document.querySelector('.fourthDay');

/* fifth day card <ul> */
let fifthDayULEl = document.querySelector('#fifthDay');
/* fifth day card */
let fifthDayCardULEl = document.querySelector('.fifthDay');



/* function to make text input the city and call fetch function */
/* also create city button, push info to localStorage */
citySubmitHandler = (event) => {
  event.preventDefault();
  //if there is previous city values, take them out
  $('.list-group').contents().remove();
  // get value from input element
  city = searchInputEl.value.trim();
  if (localStorage.getItem('"' + city + '"')) {
    searchInputEl.value = '';
    return;
  }
  console.log(city)
  getCityWeather(city);
  searchInputEl.value = '';
};

cityHistoryClickHandler = (event) => {
  event.preventDefault();
  //take out previous city values
  $('.list-group').contents().remove();
  history = $(event.target).text().replace(/ /g, '_').replace(/\./g, '-');

  console.log(history)
  $('#' + history).remove();
  history.replace(/\_/g, ' ').replace(/\-/g, '.')
  window.localStorage.removeItem('"' + history + '"');
  getCityWeather(history.replace(/\_/g, ' ').replace(/\-/g, '.'));
  console.log(history)
}

/* when the page loads check local storage and if there are any
stored cities pass them as parameters for cityConditionsBtn */

localPull = () => {
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
    cityConditionsBtn(cityInfo.replace(/\"/g, '').replace(/\_/g, ' ').replace(/\-/g, '.'), dataInfo);
  }
}


//create btn for city history search
cityConditionsBtn = (city, data) => {

  let cityID = city.replace(/ /g, '_').replace(/\./g, '-');
  //create list item for <ul> in HTML
  let cityListItemEl = document.createElement('li');
  //button inside list item
  let cityListBtnEl = document.createElement('button');
  //create classes and set data-name to the city for key in localStorage
  cityListItemEl.classList = 'searchLI col-12';
  $(cityListItemEl).attr({ 'data-name': cityID, 'id': cityID });
  //class and text for button (text is current city name)
  cityListBtnEl.classList = 'cityBtn';
  cityListBtnEl.textContent = city;
  $(cityListBtnEl).attr({ 'data-btn': city });
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
          //creates button 
          cityConditionsBtn(city, data);
          //city longitude
          cityLon = data.coord.lon;
          //city latitude
          cityLat = data.coord.lat;
          getAllForecast(cityLat, cityLon, city);
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

getAllForecast = (cityLat, cityLon, city) => {
  //one call api for UV index as well as five day forecast
  let oneAPIURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&exclude=minutely,hourly&appid=3d15e45d12f197c35af3d283e17262ae';

  fetch(oneAPIURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          //all info for current day weather card
          cityWeather = data.current.weather[0].icon;

          cityTemp = data.current.temp;
          cityHumidity = data.current.humidity;
          cityWind = data.current.wind_speed;
          cityUV = data.current.uvi;

          //day one (in five day) weather
          dayOneWeather = data.daily[0].weather[0].icon;
          let dayOneTemp = data.daily[0].temp.max;
          let dayOneHumidity = data.daily[0].humidity;

          //day two
          dayTwoWeather = data.daily[1].weather[0].icon;
          let dayTwoTemp = data.daily[1].temp.max;
          let dayTwoHumidity = data.daily[1].humidity;

          //day three
          dayThreeWeather = data.daily[2].weather[0].icon;
          let dayThreeTemp = data.daily[2].temp.max;
          let dayThreeHumidity = data.daily[2].humidity;

          //day four
          dayFourWeather = data.daily[3].weather[0].icon;
          let dayFourTemp = data.daily[3].temp.max;
          let dayFourHumidity = data.daily[3].humidity;

          //day five
          dayFiveWeather = data.daily[4].weather[0].icon;
          let dayFiveTemp = data.daily[4].temp.max;
          let dayFiveHumidity = data.daily[4].humidity;


          fontAwesomeIcon = (cityWeather) => {
            //font awesome icons in place of api's
            if (cityWeather === '50d' || cityWeather === '50n') {
              cityWeather = document.createElement('i');
              cityWeather.setAttribute('class', 'fa-duotone fa-cloud-fog');
            } else
              if (cityWeather === '02d' || cityWeather === '02n' || cityWeather === '03d' ||
                cityWeather === '03n' || cityWeather === '04d' || cityWeather === '04n') {
                cityWeather = document.createElement('i');
                cityWeather.setAttribute('class', 'fa-duotone fa-clouds');
              } else
                if (cityWeather === '01d' || cityWeather === '01n') {
                  cityWeather = document.createElement('i');
                  cityWeather.setAttribute('class', 'fa-duotone fa-sun');
                } else
                  if (cityWeather === '13d' || cityWeather === '13n') {
                    cityWeather = document.createElement('i');
                    cityWeather.setAttribute('class', 'fa-duotone fa-snowflake');
                  } else
                    if (cityWeather === '10d' || cityWeather === '10n') {
                      cityWeather = document.createElement('i');
                      cityWeather.setAttribute('class', 'fa-duotone fa-cloud-drizzle');
                    } else
                      if (cityWeather === '09d' || cityWeather === '09n') {
                        cityWeather = document.createElement('i');
                        cityWeather.setAttribute('class', 'fa-duotone fa-cloud-showers-heavy');
                      } else
                        if (cityWeather === '11d' || cityWeather === '11n') {
                          cityWeather = document.createElement('i');
                          cityWeather.setAttribute('class', 'fa-duotone fa-cloud-bolt');
                        }
            return cityWeather;
          }

          createCurrentDayCard(city, fontAwesomeIcon(cityWeather), cityTemp, cityHumidity, cityWind, cityUV);
          //end of current day info

          //all info for five day cards

          //day one card info function
          dayOne(firstDay, fontAwesomeIcon(dayOneWeather), dayOneTemp, dayOneHumidity);

          //day two card
          dayTwo(secondDay, fontAwesomeIcon(dayTwoWeather), dayTwoTemp, dayTwoHumidity);

          //day three card
          dayThree(thirdDay, fontAwesomeIcon(dayThreeWeather), dayThreeTemp, dayThreeHumidity);

          //day four card
          dayFour(fourthDay, fontAwesomeIcon(dayFourWeather), dayFourTemp, dayFourHumidity);

          //day five card
          dayFive(fifthDay, fontAwesomeIcon(dayFiveWeather), dayFiveTemp, dayFiveHumidity);




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


createCurrentDayCard = (city, cityWeather, cityTemp, cityHumidity, cityWind, cityUV) => {
  //city name (date in 3/21/2021 format) icon representing current weather conditions
  let cityNameEl = document.createElement('li');
  cityNameEl.classList = 'mainCardLi';
  cityNameEl.setAttribute('id', 'cityNameMain');
  cityNameEl.textContent = city + ' ( ' + cityDate + ' ) ';
  cityNameEl.append(cityWeather);

  // example (Temperature: ) format for current temp
  let temperatureMainEl = document.createElement('li');
  temperatureMainEl.classList = 'mainCardLi';
  temperatureMainEl.textContent = 'Temperature: ' + Math.floor(cityTemp) + String.fromCharCode(176) + 'F';

  // example (Humidity: ) format for humidity
  let humidityEl = document.createElement('li');
  humidityEl.classList = 'mainCardLi';
  humidityEl.textContent = 'Humidity: ' + cityHumidity + '%';

  // example (wind speed: 4.7mph)
  let windEl = document.createElement('li');
  windEl.classList = 'mainCardLi';
  windEl.textContent = 'Wind Speed: ' + cityWind + 'MPH';
  //UV index: colored box indicating severity with format (9.49) inside
  let cityUVEl = document.createElement('li');
  let cityUVElSpan = document.createElement('span');
  if (cityUV < 3) {
    cityUVEl.textContent = 'UV Index: ';
    cityUVElSpan.setAttribute('class', 'low');
    cityUVElSpan.textContent = cityUV;
    cityUVFontA = document.createElement('i')
    cityUVFontA.setAttribute('class', 'fa-duotone fa-face-smile');
    cityUVElSpan.appendChild(cityUVFontA);
    cityUVEl.appendChild(cityUVElSpan);
  } else
    if (cityUV >= 3 && cityUV < 8) {
      cityUVEl.textContent = 'UV Index: ' + cityUV;
      cityUVElSpan.setAttribute('class', 'moderate');
      cityUVElSpan.textContent = cityUV;
      cityUVFontA = document.createElement('i')
      cityUVFontA.setAttribute('class', 'fa-duotone fa-fire');
      cityUVElSpan.appendChild(cityUVFontA);
      cityUVEl.appendChild(cityUVElSpan);
    } else
      if (cityUV >= 8) {
        cityUVEl.textContent = 'UV Index: ' + cityUV;
        cityUVElSpan.setAttribute('class', 'severe');
        cityUVElSpan.textContent = cityUV;
        cityUVFontA = document.createElement('i')
        cityUVFontA.setAttribute('class', 'fa-duotone fa-skull-crossbones');
        cityUVElSpan.appendChild(cityUVFontA);
        cityUVEl.appendChild(cityUVElSpan);
      }
  //append to <ul> in the main card
  mainCityConditionsEL.append(cityNameEl, temperatureMainEl, humidityEl, windEl, cityUVEl);
};

//five day forecast

//first day
dayOne = (firstDay, dayOneWeather, dayOneTemp, dayOneHumidity) => {
  let dateEl = document.createElement('li');
  dateEl.classList = 'cardLi dates';
  dateEl.textContent = firstDay;

  let weatherEl = document.createElement('li');
  dateEl.classList = 'cardLi';
  weatherEl.appendChild(dayOneWeather);

  let temperatureMainEl = document.createElement('li');
  temperatureMainEl.classList = 'cardLi';
  temperatureMainEl.textContent = 'Temperature: ' + Math.floor(dayOneTemp) + String.fromCharCode(176) + 'F';

  let humidityEl = document.createElement('li');
  humidityEl.classList = 'mainCardLi';
  humidityEl.textContent = 'Humidity: ' + dayOneHumidity + '%';

  firstDayULEl.append(dateEl, dayOneWeather, temperatureMainEl, humidityEl);
}

//second day
dayTwo = (secondDay, dayTwoWeather, dayTwoTemp, dayTwoHumidity) => {
  let dateEl = document.createElement('li');
  dateEl.classList = 'cardLi dates';
  dateEl.textContent = secondDay;

  let weatherEl = document.createElement('li');
  dateEl.classList = 'cardLi';
  weatherEl.appendChild(dayTwoWeather);

  let temperatureMainEl = document.createElement('li');
  temperatureMainEl.classList = 'cardLi';
  temperatureMainEl.textContent = 'Temperature: ' + Math.floor(dayTwoTemp) + String.fromCharCode(176) + 'F';

  let humidityEl = document.createElement('li');
  humidityEl.classList = 'mainCardLi';
  humidityEl.textContent = 'Humidity: ' + dayTwoHumidity + '%';

  secondDayULEl.append(dateEl, dayTwoWeather, temperatureMainEl, humidityEl);
}

//third day
dayThree = (thirdDay, dayThreeWeather, dayThreeTemp, dayThreeHumidity) => {
  let dateEl = document.createElement('li');
  dateEl.classList = 'cardLi dates';
  dateEl.textContent = thirdDay;

  let weatherEl = document.createElement('li');
  dateEl.classList = 'cardLi';
  weatherEl.appendChild(dayThreeWeather);

  let temperatureMainEl = document.createElement('li');
  temperatureMainEl.classList = 'cardLi';
  temperatureMainEl.textContent = 'Temperature: ' + Math.floor(dayThreeTemp) + String.fromCharCode(176) + 'F';

  let humidityEl = document.createElement('li');
  humidityEl.classList = 'mainCardLi';
  humidityEl.textContent = 'Humidity: ' + dayThreeHumidity + '%';

  thirdDayULEl.append(dateEl, dayThreeWeather, temperatureMainEl, humidityEl);
}

//fourth day
dayFour = (fourthDay, dayFourWeather, dayFourTemp, dayFourHumidity) => {
  let dateEl = document.createElement('li');
  dateEl.classList = 'cardLi dates';
  dateEl.textContent = fourthDay;

  let weatherEl = document.createElement('li');
  dateEl.classList = 'cardLi';
  weatherEl.appendChild(dayFourWeather);

  let temperatureMainEl = document.createElement('li');
  temperatureMainEl.classList = 'cardLi';
  temperatureMainEl.textContent = 'Temperature: ' + Math.floor(dayFourTemp) + String.fromCharCode(176) + 'F';

  let humidityEl = document.createElement('li');
  humidityEl.classList = 'mainCardLi';
  humidityEl.textContent = 'Humidity: ' + dayFourHumidity + '%';

  fourthDayULEl.append(dateEl, dayFourWeather, temperatureMainEl, humidityEl);
}

//fifth day
dayFive = (fifthDay, dayFiveWeather, dayFiveTemp, dayFiveHumidity) => {
  let dateEl = document.createElement('li');
  dateEl.classList = 'cardLi dates';
  dateEl.textContent = fifthDay;

  let weatherEl = document.createElement('li');
  dateEl.classList = 'cardLi';
  weatherEl.appendChild(dayFiveWeather);

  let temperatureMainEl = document.createElement('li');
  temperatureMainEl.classList = 'cardLi';
  temperatureMainEl.textContent = 'Temperature: ' + Math.floor(dayFiveTemp) + String.fromCharCode(176) + 'F';

  let humidityEl = document.createElement('li');
  humidityEl.classList = 'mainCardLi';
  humidityEl.textContent = 'Humidity: ' + dayFiveHumidity + '%';

  fifthDayULEl.append(dateEl, dayFiveWeather, temperatureMainEl, humidityEl);
}

searchFormEl.addEventListener('submit', citySubmitHandler);

searchULEl.addEventListener('click', cityHistoryClickHandler)

localPull();

