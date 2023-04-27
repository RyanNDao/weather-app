const getWeatherButton = document.querySelector('.get-data');
const cityInput = document.querySelector('#city-location');
const loading = document.querySelector('.loading-overlay');
const cityStateHero = document.querySelector('.city-state');
const weatherInfoContainer = document.querySelector('.weather-container');

getWeatherButton.addEventListener('click',()=>{  
    getWeatherData(cityInput.value)
        .then(changeWeatherLocation, alert);
    cityInput.value = '';
})

async function getWeatherData(location='london'){
    loading.classList.remove('hidden');
    try{
        weatherData = await fetch(`https://api.weatherapi.com/v1/current.json?key=c2be0e7a098d47cc8a312712231804&q=${location}`)
        if (weatherData.status === 400){
            throw new Error;
        } else {
            weatherDataJson = weatherData.json()
            return weatherDataJson
        }
    } catch (error){
        throw new Error('Could not find weather data');
    } finally{
        loading.classList.add('hidden');
    }
}



function getWeatherGif(condition){
    let gifContainer = document.querySelector('.gif-container');
    let gifError = document.querySelector('.gif-error');
    fetch(`https://api.giphy.com/v1/gifs/translate?api_key=9ZU5JlKwJJCWhE6Mymgqtp6U0s5Pjjqu&s=${condition}%20weather`, {mode: 'cors'})
        .then((response)=>{return response.json()})
        .then((responseJson)=>{
            gifContainer.style.backgroundImage = `url('${responseJson.data.images.original.url}'`;
            gifError.classList.add('hidden')
        })
        .catch(
            ()=>{gifError.classList.remove('hidden');
        });
}


function changeWeatherDetails(weatherDataJson){
    const humidityText = document.querySelector('.humidity');
    const feelslikeText = document.querySelector('.feels-like');
    const visibilityText = document.querySelector('.visibility');
    const windspeedText = document.querySelector('.wind-speed');
    humidityText.textContent = weatherDataJson.current.humidity;
    feelslikeText.textContent = `${weatherDataJson.current.feelslike_f} °F`;
    visibilityText.textContent = `${weatherDataJson.current.vis_miles} miles`;
    windspeedText.textContent = `${weatherDataJson.current.wind_mph} mph`;
}

function changeWeatherLocation(weatherDataJson){
    console.log(weatherDataJson)
    locationData = weatherDataJson.location;
    weatherInfoContainer.innerHTML = '';
    cityStateHero.textContent = `${locationData.name}, ${locationData.region}`;
    weatherInfoContainer.appendChild(createElement('div','temp',`${weatherDataJson.current.temp_f}°F`));
    weatherInfoContainer.appendChild(createElement('div','condition',`${weatherDataJson.current.condition.text.toUpperCase()}`));
    changeWeatherDetails(weatherDataJson);
    getWeatherGif(weatherDataJson.current.condition.text);
}

function createElement(type, classes, text){
    let element = document.createElement(type);
    if (classes.length !== 0){
        typeof(classes) === 'object' ? element.classList.add(...classes) : element.classList.add(classes);
    }
    element.textContent = text;
    return element;
}

getWeatherData().then(changeWeatherLocation, alert);