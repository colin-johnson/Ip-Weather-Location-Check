/**
 * Created by colinjohnson on 5/13/16.
 */
//----------------------------------------------------
// CONSTANTS
//------------------------------------------*/
var request = new XMLHttpRequest();
var weatherCondition;

//------------------------------------------*/
// VARIABLES
/*------------------------------------------*/
var app         = document.getElementById('app'),
    preview     = document.getElementById('preview'),
    weatherCard = document.getElementById('weather-card'),
    title       = document.getElementById('title'),
    city        = document.getElementById('city'),
    temp        = document.getElementById('temp'),
    icon        = document.getElementById('icon'),
    condition   = document.getElementById('condition');

//------------------------------------------*/
// DATA REQUEST
/*------------------------------------------*/
var dataRequest = {
    //ajax current ip address location
    geoRequest: function() {
        request.open('GET', 'https://weathersync.herokuapp.com/ip', true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                var geoData = JSON.parse(request.responseText);
                console.log(geoData);

                dataRequest.weatherRequest(geoData.location.latitude, geoData.location.longitude);
            } else {
                dataRequest.dataFailed();
            }
        };

        request.send();
    },
    //ajax latitude and longitude data from the geoRequest() call into weather api
    weatherRequest: function (lat, lng) {
        request.open('GET', 'https://weathersync.herokuapp.com/weather/' + lat + ',' + lng, true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                var weatherData = JSON.parse(request.responseText);

                //if latitude and longitude coordinates return an error
                if(weatherData.code == "404" || weatherData.message == true){
                    dataRequest.dataFailed();
                } else {
                    //convert ajax data Kelvin to Fahrenheit
                    var weatherTemp = dataRequest.kelvinToFahrenheit(weatherData.main.temp);
                        weatherTemp = weatherTemp.toString();
                    //convert weather condition data to title case
                    var weatherDescription = dataRequest.toTitleCase(weatherData.weather[0].description);

                    weatherCondition = {
                        header: "Current Conditions For:",
                        city: weatherData.name,
                        temperature: weatherTemp.split(".")[0] + " &#8457",
                        icon: "http://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png",
                        condition: weatherDescription
                    };

                    dataRequest.dataReady();
                }

            } else {
                dataRequest.dataFailed();
            }
        };

        request.send();
    },

    dataReady: function() {
        title.innerHTML = weatherCondition.header;
        city.innerHTML  = weatherCondition.city;
        temp.innerHTML  = weatherCondition.temperature;
        icon.src        = weatherCondition.icon;
        condition.innerHTML   = weatherCondition.condition;
        preview.classList.add('fade-out');
        setTimeout(function() {
            preview.style.display = "none";
            weatherCard.style.display = "flex";
            weatherCard.classList.add('animate-card');
            app.classList.add('slide-down');
        }, 500);

    },

    dataFailed: function() {
        title.innerHTML = "We were unable to retrieve this location's weather data, try somewhere new!";
        city.innerHTML  = "-";
        temp.innerHTML  = "-";
        icon.style.display    = "none";
        condition.innerHTML   = "-";
        preview.classList.add('fade-out');
        setTimeout(function() {
            preview.style.display = "none";
            weatherCard.style.display = "flex";
            weatherCard.classList.add('animate-card');
            app.classList.add('slide-down');
        }, 500);
    },

    dataRefresh: function() {
        weatherCard.style.display = "none";
        preview.style.display = "flex";
        preview.classList.remove('fade-out');
        dataRequest.geoRequest();
    },

    kelvinToFahrenheit: function(int) {
        return int * 9/5 - 459.67;
    },

    toTitleCase: function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
};



