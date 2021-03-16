
let apiKey = '3d15e45d12f197c35af3d283e17262ae';

let city = 'Nashville';

getCityWeather = () => {
  
  let test = fetch('http://api.openweathermap.org/data/2.5/weather?q=Nashville&appid=3d15e45d12f197c35af3d283e17262ae');
  console.log(test);
}

getCityWeather();