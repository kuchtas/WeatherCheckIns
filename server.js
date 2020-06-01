"use strict"
const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();
const app = express();

const database = new Datastore('checkins.db');
database.loadDatabase();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`I am listening at ${port}`));
app.use(express.static('public'));
app.use(express.json());

app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp || "unknown";
    console.log(data);
<<<<<<< HEAD
    database.remove({ coordinates: data.coordinates }, { multi: true });
    database.insert(data);
    database.persistence.compactDatafile();
=======
    database.update({ coordinates: data.coordinates, }, { $set: { ...data } }, { upsert: true })
>>>>>>> parent of 3a79682... Removing unnecessary documents from database

    response.json({
        status: 'success',
        ...data

    })
})

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    })
})

app.get('/weather/lat/:lat/long/:long', async (request, response) => { //proxy for the OpenWeatherMaps
    const api_key = process.env.API_KEY;
    const lat = request.params.lat;
    const long = request.params.long;
    const data = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}&units=metric`);
    const dataJSON = await data.json();
    response.json(dataJSON);
})