/* variable to store city searched */
let city;

/* submit city button */
let searchFormEl = document.querySelector('#searchForm');

/* city input line */
let searchInputEl = document.querySelector('#searchInput');

/* search city history ul for city list item buttons */
let searchULEl = document.querySelector('#searchUL');

/* function to make text input the city and call fetch function */
/* also create city button, push info to localStorage */
citySubmitHandler = (event) => {
  event.preventDefault();
  console.log(event.target)

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
    cityConditionsBtn(cityInfo.replace(/\"/g, ''), dataInfo);
  }
})


cityConditionsBtn = (city, data) => {

  let cityListItemEl = document.createElement('li');

  let cityListBtnEl = document.createElement('button');

  cityListItemEl.classList = 'searchLI col-12';
  cityListItemEl.setAttribute('data-name', city);

  cityListBtnEl.classList = 'cityBtn';
  cityListBtnEl.textContent = city;

  cityListItemEl.appendChild(cityListBtnEl);

  searchULEl.appendChild(cityListItemEl);

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
          console.log(data, city);
          cityConditionsBtn(city, data);
        })
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to weather data");
    });
}

searchFormEl.addEventListener("submit", citySubmitHandler);



