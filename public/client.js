"use strict"

let lat, long;
const button = document.getElementById("submitButton");

if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
        try {
            lat = position.coords.latitude;
            long = position.coords.longitude;

            if (typeof lat === 'undefined' || typeof long === 'undefined') { // if there are no lat nor long the geolocation failed or is blocked
                alert('Please allow geolocation in order to check in!\nIf it is already turned on try refreshing the page');
                return;
            }

            document.getElementById('latitude').textContent = lat;
            document.getElementById('longitude').textContent = long;
            const responseGetAPI = await fetch(`/weather/lat/${lat}/long/${long}`);
            const jsonGetAPI = await responseGetAPI.json();
            //console.log(jsonGetAPI);
            const area = jsonGetAPI.name || "unknown";
            const country = jsonGetAPI.sys.country || "unknown";
            const description = jsonGetAPI.weather[0].description || "unknown";
            const temp = jsonGetAPI.main.temp || "unknown";
            const feels_like = jsonGetAPI.main.feels_like || "unknown";
            const speed = jsonGetAPI.wind.speed || "unknown";
            const clouds = jsonGetAPI.clouds.all || "unknown";
            document.getElementById("area").textContent = area + ', ' + country;
            document.getElementById("conditions").textContent = description;
            document.getElementById("wind").textContent = speed + ' m/s';
            document.getElementById("temp").textContent = temp;
            document.getElementById("clouds").textContent = clouds;
            document.getElementById("tempFeel").textContent = feels_like;

            button.addEventListener('click', async event => {
                const dataForDB = {
                    coordinates: { lat, long }, area, country, description, temp, feels_like, speed, clouds
                };
                const responsePostToDB = await fetch('/api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataForDB)
                });
                const responseJSONtoDB = await responsePostToDB.json();
                //console.log(responseJSONtoDB);
            });
        }
        catch{
            console.log('Something went wrong while fetching data from the OpenWeatherAPI or to the server');
        }
    }, error => {
        if (error.PERMISSION_DENIED) {
            alert('Please allow geolocation and refresh the page!');
            document.body.innerHTML = "";
        }
    });
}
else
    console.log('geolocation unavailabe');
