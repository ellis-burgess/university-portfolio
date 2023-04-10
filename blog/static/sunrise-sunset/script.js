const enterLocation = document.getElementById('location');
const submit = document.getElementById('submit');
const myLocation = document.getElementById('my-location');
const dateInput = document.getElementById('calendar');
const main = document.getElementsByTagName('main')[0];

const displayLocation = document.createElement('p');
const displaySunrise = document.createElement('p');
const displaySunset = document.createElement('p');

const p = {
    lat: 51.480555,
    lng: -3.178007,
};

// Key for accessing Geoapify API
const geocodeKey = 'b80f89d64b934b62900934da606b98e6';
const currentDate = new Date();

let currentLocation = 'Wales, United Kingdom';
let sunrise = new Date();
let sunset = new Date();
let timezone = '';

let currentYear = currentDate.getFullYear()
let currentMonth = parseDate(currentDate.getMonth() + 1)
let currentDay = parseDate(currentDate.getDate());

dateInput.value = `${currentYear}-${currentMonth}-${currentDay}`;

// Correctly format day/month to have leading 0 if less than 10
function parseDate(x) {
    if (x < 10) {
        return `0${x}`
    } else {
        return x
    }
}

// From sunrise-sunset API, get sunrise and sunset times for given longitude and latitude today
function getSunriseSunset(p) {
    fetch(`https://api.sunrise-sunset.org/json?lat=${p.lat}&lng=${p.lng}&date=${dateInput.value}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            sunrise = updateDate(data.results.sunrise);
            sunset = updateDate(data.results.sunset);
            returnSunriseSunset(sunrise, sunset);
        })
}

// Given sunrise/sunset string from sunrise-sunset API, return a new Date set to the appropriate time.
function updateDate(time) {
    // Time formatted in API as "HH:MM:SS AM/PM"
    time = time.split(' ');
    // time[0] = "HH:MM:SS"; split into hour, minute, second
    let HMS = time[0].split(':');
    // If PM (unless 12pm), add 12 to hour
    if (time[1] === 'PM' && HMS[0] != '12') {
        HMS[0] = parseInt(HMS[0]);
        HMS[0] += 12;
    }
    let returnDate = new Date(dateInput.value);
    returnDate.setHours(HMS[0], HMS[1], HMS[2]);
    return returnDate;
}

// Display location, sunrise time, and sunset time on webpage
function returnSunriseSunset(sunrise, sunset) {
    let formattedSunrise = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', timeZone: timezone }).format(sunrise);
    let formattedSunset = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', timeZone: timezone }).format(sunset);

    displayLocation.textContent = `Location: ${currentLocation}`;
    displaySunrise.textContent = `Sunrise: ${formattedSunrise}`;
    displaySunset.textContent = `Sunset: ${formattedSunset}`;

    main.appendChild(displayLocation);
    main.appendChild(displaySunrise);
    main.appendChild(displaySunset);
}

// On clicking submit, get longitude and latitude for location entered in textbox
submit.addEventListener('click', () => {
    // Clear any previous inputs
    displayLocation.textContent = displaySunrise.textContent = displaySunset.textContent = '';
    // If user has not made any input, show error message
    if (enterLocation.value === '') {
        displayLocation.textContent = 'Please input a location, or select "use my location".';
        main.appendChild(displayLocation);
        return;
    }
    fetch(`https://api.geoapify.com/v1/geocode/search?text=${enterLocation.value}&apiKey=${geocodeKey}`)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            // If user has not entered a valid location, show error message
            if (data.features.length == 0) {
                displayLocation.textContent = 'Sorry, I don\'t recognise that location. Please try again';
                main.appendChild(displayLocation);
                return;
            }
            // Get latitude and longitude
            p.lng = data.features[0].geometry.coordinates[0];
            p.lat = data.features[0].geometry.coordinates[1];
            // Get current location as "City, Country" string
            currentLocation = '';
            if (data.features[0].properties.city != undefined) {
                currentLocation = `${data.features[0].properties.city}, `
            }
            currentLocation += `${data.features[0].properties.country}`;
            timezone = data.features[0].properties.timezone.name
            getSunriseSunset(p);
        })
})

// On clicking "use my location", use built-in geolocation API to get coordinates and reverse lookup location
myLocation.addEventListener('click', () => {
    // Clear any previous inputs
    displayLocation.textContent = displaySunrise.textContent = displaySunset.textContent = '';
    // Test if browser supports Geolocation
    // Adapted from https://www.javascripttutorial.net/web-apis/javascript-geolocation/
    // Accessed 28 December 2022
    if (navigator.geolocation) {
        displayLocation.textContent = 'Getting your location...'
        main.appendChild(displayLocation);
        navigator.geolocation.getCurrentPosition((position) => {
            p.lng = position.coords.longitude;
            p.lat = position.coords.latitude;
            // Reverse lookup coordinates to get place name and timezone
            fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${p.lat}&lon=${p.lng}&apiKey=${geocodeKey}`)
                .then(function(response) {
                    return response.json()
                })
                .then(function(data) {
                    currentLocation = `${data.features[0].properties.city}, ${data.features[0].properties.country}`;
                    timezone = data.features[0].properties.timezone.name
                    getSunriseSunset(p);
                })
          })
    }
    else {
        displayLocation.textContent = 'Sorry, we can\'t get your location.';
        main.appendChild(displayLocation);
    }
});

dateInput.addEventListener('change', () => {
    // If no date is input, reset to current date (avoids issues sending API request without date information)
    if (dateInput.value == '') {
        sunrise = sunset = currentDate;
        dateInput.value = `${(currentDate.getFullYear())}-${parseDate(currentDate.getMonth() + 1)}-${parseDate(currentDate.getDate())}`;
    } else {
        sunrise = sunset = new Date(dateInput.value);
    }
})