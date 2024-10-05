const locationBtn = document.querySelector(".location-btn");  
const display = document.querySelector(".details");  
const currentWeatherDiv = document.querySelector(".current-weather");  
const searchBtn = document.querySelector(".search-btn");  
const successMessage = document.querySelector(".success-message");

const apiKey = "fb4b8e9edbff4c4cac6150605241309";  

const getWeatherDetails = (url) => {  
   
    fetch(url)  
        .then(response => {  
            if (!response.ok) {  
                throw new Error(`HTTP error! Status: ${response.status}`);  
            }  
            return response.json();  
        })  
        .then(data => {  
            const temp = Math.floor(data.current.temp_c);  
            const lat = Math.floor(data.location.lat);  
            const lon = Math.floor(data.location.lon);  
            const wind = data.current.wind_kph;  
            const humidity = data.current.humidity;  

            currentWeatherDiv.querySelector(".lon").textContent = `Longitude: ${lon}`;  
            currentWeatherDiv.querySelector(".lat").innerHTML = `Latitude: ${lat}<span>°C</span>`;  
            currentWeatherDiv.querySelector(".temperature").innerHTML = `Temperature: ${temp}<span>°C</span>`;  
            currentWeatherDiv.querySelector(".wind").textContent = `Wind: ${wind} kph`;  
            currentWeatherDiv.querySelector(".hum").textContent = `Humidity: ${humidity}`;  
            
            
        })  
        .catch(error => {  
            console.error('Error fetching the weather data:', error);  
            alert(`Error fetching the current weather data: ${error.message}`);
              });  
}  

const getFiveDays = (url) => {  
    
    fetch(url)  
        .then(response => {  
            if (!response.ok) {  
                throw new Error(`HTTP error! Status: ${response.status}`);  
            }  
            return response.json();  
        })  
        .then(data => {  
            console.log(data);  
            let k = 1;  
            const forecast = data.forecast.forecastday;  

            forecast.forEach(d => {  
                const output = document.getElementById(`${k}`);  
                output.innerHTML = "";  
                const date = d.date;  
                const temperature = d.day.avgtemp_c;  
                const humidity = d.day.avghumidity;  
                const wind = d.day.maxwind_kph;  

                const dayDiv = document.createElement('div');  
                dayDiv.classList.add("day");  
                dayDiv.innerHTML = `  
                <p>${date} </p>  
                <p>Temperature: ${temperature}°C</p>  
                <p>Wind: ${wind}</p>  
                <p>Humidity: ${humidity}%</p>  
                `;  
                output.appendChild(dayDiv);   
                k+=1;   
            });  
            successMessage.textContent = "Forecast Fetched Successfully!"; // Show success message  
            successMessage.style.display = "block";
            setTimeout(() => {  
                successMessage.textContent = "";  
                successMessage.style.display = "none";  
            }, 2000);
        })  
        .catch(error => {  
            console.error('Error fetching the weather data:', error);  
            successMessage.textContent = ""; // Clear success message if there's an error  
            alert(`Error fetching the 5-day forecast: ${error.message}`); 
              });  
}  

searchBtn.addEventListener("click", () => {  
    const cityInput = document.querySelector(".city-input");  
    const city = cityInput.value.trim();  
    const day = 3;  

    const api = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}`;  
    const five_url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${day}`;  
    getWeatherDetails(api);  
    getFiveDays(five_url);  
    cityInput.value = "";  
});  

locationBtn.addEventListener("click", () => {  
    if (navigator.geolocation) {  
        navigator.geolocation.getCurrentPosition((position) => {  
            const latitude = position.coords.latitude;  
            const longitude = position.coords.longitude;  
            const day = 3;  

            const api_url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}`;  
            const five_url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=${day}`;  
            getWeatherDetails(api_url);  
            getFiveDays(five_url);  
        }, error);  
    } else {  
        display.textContent = "Geolocation is not supported by this browser";  
    }  
});  

function error() {  
    display.textContent = "Unable to retrieve your location.";  
}