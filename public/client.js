"use strict"

let lat, long;

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
            const { name } = jsonGetAPI;
            const { country } = jsonGetAPI.sys;
            const { description } = jsonGetAPI.weather[0];
            const { temp, feels_like } = jsonGetAPI.main;
            const { speed } = jsonGetAPI.wind;
            const clouds = jsonGetAPI.clouds.all;
            document.getElementById("area").textContent = name + ', ' + country;
            document.getElementById("state").textContent = description;
            document.getElementById("wind").textContent = speed + ' m/s';
            document.getElementById("temp").textContent = temp;
            document.getElementById("clouds").textContent = clouds;
            document.getElementById("tempFeel").textContent = feels_like;

            const dataForDB = {
                coordinates: { lat, long }, name, country, description, temp, feels_like, speed, clouds
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
        }
        catch{
            console.log('Something went wrong while fetching data from the OpenWeatherAPI');
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
