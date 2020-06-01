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
        /*const root = document.createElement('div');
        const date = document.createElement('ul');
        const lat = document.createElement('li');
        const long = document.createElement('li');

        lat.textContent = `Latitude: ${item.lat}°`;
        long.textContent = `Longitude: ${item.long}°`;
        const dateString = new Date(item.timestamp).toLocaleString();   // convert the timestamp into a full date and time
        date.textContent = `Date: ${dateString}`;

        root.append(date);
        date.append(lat, long);
        document.body.append(root);*/
    }
}

const mymap = L.map('mapid').setView([52, 19], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 16,
    minZoom: 2,
}).addTo(mymap);

getData();