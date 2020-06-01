"use strict"

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();

    for (let item of data) {
        const dateString = new Date(item.timestamp).toLocaleString();
        const marker = L.marker([item.coordinates.lat, item.coordinates.long]).addTo(mymap);
        const markerText = `Area: ${item.area}, ${item.country}<br>
        Time: ${dateString}<br>
        Conditions: ${item.description}<br>
        Wind: ${item.speed} m/s<br>
        Cloudiness: ${item.clouds}%<br>
        Temperature: ${item.temp}&deg;C (feels like ${item.feels_like}&deg;C)`

        marker.bindPopup(markerText);
    }
}

const corner1 = L.latLng(-90, -200)
const corner2 = L.latLng(90, 200)
const bounds = L.latLngBounds(corner1, corner2)

const mymap = L.map('mapid').setView([52, 19], 7).setMaxBounds(bounds);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 16,
    minZoom: 2,
}).addTo(mymap);

const button = document.getElementById("deleteButton");

getData();
button.addEventListener('click', async event => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            const dataToRemove = { coordinates: { lat, long } };
            const responseRemoveFromDB = await fetch('/remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToRemove),
            });
            const result = await responseRemoveFromDB.json();
            console.log(result);
            if (result.success === true) {
                alert('Your location has been successfuly deleted from the database');
            }
            else {
                alert('Error or no data to remove');
            }
        });
    }
});