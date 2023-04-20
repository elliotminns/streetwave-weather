//Set Express
var express = require('express');

//Set Axios
const axios = require('axios');

//Set Path
var path = require('path');

//Set Server Port
const PORT = 8080;

//Set EJS as View Engine
var app = express();
app.set("view engine", "ejs");

//Tell Express where to find Stylesheet
app.use(express.static(path.join(__dirname, 'public')));

// Import body-parser module
const bodyParser = require('body-parser');

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

//Set API Variables
const apiKey = 'GXGBCUTJD64JHRGUALT63HSUT';

// Create a new Date object representing the current date and time
const currentDate = new Date();

// Get the year, month, and day from the Date object
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so we add 1 and pad with leading zeros
const day = String(currentDate.getDate()).padStart(2, '0'); // Pad day with leading zeros

// Format the current date as a string in the format "YYYY-MM-DD"
const formattedDate = `${year}-${month}-${day}`;

// Create a new Date object representing tomorrow's date
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);

// Get the year, month, and day from the tomorrowDate object
const tomorrowYear = tomorrowDate.getFullYear();
const tomorrowMonth = String(tomorrowDate.getMonth() + 1).padStart(2, '0');
const tomorrowDay = String(tomorrowDate.getDate()).padStart(2, '0');

// Format tomorrow's date as a string in the format "YYYY-MM-DD"
const formattedTomorrowDate = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;

//Define Variables for temp, humidity, and icon
let temp = 0;
let humidity = 0;
let icon = '';

let tempTomorrow = 0;
let humidityTomorrow = 0;
let iconTomorrow = '';

app.post('/weather', (req, res) => {
    const longitude = req.body.longitude;
    const latitude = req.body.latitude;

    let location = `${latitude},${longitude}`;

    axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${formattedDate}/?key=${apiKey}&unitGroup=uk`)
    .then(response => {
        let data = response.data;

        temp = data.currentConditions.temp;
        humidity = data.currentConditions.humidity;
        icon = data.currentConditions.icon;

        if (icon === 'partly-cloudy-day' || icon === 'partly-cloudy-night' || icon === 'cloudy'){
            icon = '/images/cloud.png';
        }
        else if (icon === 'rain'){
            icon = '/images/rain.png';
        }
        else {
            icon = '/images/sun.png';
        }

        res.render("index.ejs", { temp: temp, humidity: humidity, icon: icon });
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
    });

    axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${formattedTomorrowDate}/?key=${apiKey}&unitGroup=uk`)
    .then(response => {
        let tomorrowData = response.data;

        console.log(tomorrowData);

        let tempTomorrow = tomorrowData.days[0].temp;
        let humidityTomorrow = tomorrowData.days[0].humidity;
        let iconTomorrow = tomorrowData.days[0].icon;
        
        if (iconTomorrow === 'partly-cloudy-day' || iconTomorrow === 'partly-cloudy-night' || iconTomorrow === 'cloudy'){
            iconTomorrow = '/images/cloud.png';
        }
        else if (iconTomorrow === 'rain'){
            iconTomorrow = '/images/rain.png';
        }
        else {
            iconTomorrow = '/images/sun.png';
        }
        
        console.log(tempTomorrow, humidityTomorrow, iconTomorrow);

        res.render("index.ejs", { temp: temp, humidity: humidity, icon: icon, tempTomorrow: tempTomorrow, humidityTomorrow: humidityTomorrow, iconTomorrow: iconTomorrow });
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
    });
});

app.get('/', (request, response) => {
    response.render("index", { temp: temp, humidity: humidity,  icon: icon });
  });

// start server
app.listen(PORT);
console.log('Listening on port %s', PORT)