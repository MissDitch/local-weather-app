$(document).ready(function() {	
  init();
  $("#tempBtn").click(changeGrade);
  $("#locBtn").click(changeLocation); 
})

function init() {  
 
  var queryString = "";
  
  if (navigator.geolocation) {
 //  if ("geolocation" in navigator) { 
	navigator.geolocation.getCurrentPosition(success, error);
  }
  
  function success(pos) {  
  var crd = pos.coords;
  queryString = makeQueryString(crd.latitude, crd.longitude);
//  console.log("pos: " + queryString);
  $.ajax( {
    url: queryString,
    success: function(data) {
      var address = data.results[1].formatted_address;
   $("#location").html(address); 
   getWeatherByCoord(crd.latitude, crd.longitude);
    },
    cache: false
  });
}

function error(err) {
    $("#altLocation").removeClass("notVisible");
  /*the latest Chrome turned off support for geolocation API on insecure networks. 
  This works, although position is not as accurate:
  */
   $.ajax({
      url: "https://ipinfo.io/geo",
      success: function(data) {
      //  console.log(data);
        var latlong = data.loc.split(',');
     //   console.log(latlong);
        latitude = latlong[0];
        longitude = latlong[1];
      //  console.log("latitude: " + latitude);
      //  console.log("longitude: " + longitude);
        queryString = makeQueryString(latitude, longitude);
       //  console.log(queryString);
         $.ajax( {
    url: queryString,
    success: function(data){
     var address = data.results[1].formatted_address;
     $("#location").html(address); 
     getWeatherByCoord(latitude, longitude);
    },
    cache: false
  });
      }
    });  
//  console.log("err: " + queryString);  
 $("#location").html("no location found");
}
  

  
}   /* end init  */

//https://crossorigin.me/ //not working anymore
//https://cors-anywhere.herokuapp.com/

function makeQueryString(latitude, longitude) {
   var queryString = "http://maps.googleapis.com/maps/api/geocode/json?latlng=";
  queryString += latitude + "," + longitude + "&sensor=true";
  return queryString;
}

function makeQueryStringAlt(cityName, countryCode) {
var queryString = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName +  "," + countryCode + "&units=metric&APPID=e499501d29e2da5a054467f5367424bc";
 
  return queryString;
}

function changeLocation(e) {
  var city = $("#city").val();
  console.log("city is: "+ city);
  var country = $("#country").val();
  console.log("country is " + country);
  getWeatherByLocation(city, country);
 hideForm();
    $("#tempBtn").innerHTML = "To Fahrenheit";
}

function getWeatherByLocation(city, country) {  
  var queryString = makeQueryStringAlt(city, country);
  $.ajax( {
    url: queryString,
    success:function(data) {
      showWeather(data); 
    
      
    },
    cache: false
  });  
}



/*function showPosition(data) {
   console.log(data);
   var address = data.results[1].formatted_address;
   $("#location").html("Your current position is: <br>" + address); 
   getWeather(crd.latitude, crd.longitude);
}
*/
// http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139
// http://api.openweathermap.org/data/2.5/forecast/city?id=524901&APPID=e499501d29e2da5a054467f5367424bc

//http://maps.googleapis.com/maps/api/geocode/json?latlng=44.4647452,7.3553838&sensor=true


function getWeatherByCoord(latitude, longitude) {
   //api.openweathermap.org/data/2.5/weather?lat=35&lon=139
  var queryString = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude +  "&lon=" + longitude + "&units=metric&APPID=e499501d29e2da5a054467f5367424bc";
   console.log(queryString);//http://openweathermap.org/api_station
  $.ajax( {
    url: queryString,
    success: function(data) {    
      showWeather(data);     
    },
    cache: false
  });  
}
  
function showWeather(data) {
  	isCelsius = true;
    $("#tempBtn").innerHTML = "To Fahrenheit";
  console.log(data);
  console.log("isCelsius is: "  + isCelsius);
  var city = data.name;
  var country = data.sys.country;
   var address = city + ", " + country;
    $("#location").html(address); 
    $("#temperature").html(Math.round(data.main.temp)); 
  $("#grade").html("C");
       $("#icon").html('<img alt="weather icon" class="" src="http://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/' +  data.weather[0].icon + '.png">'); 
       $("#description").html(data.weather[0].description); 
      var degree = data.wind.deg;
      console.log("degree is: " + degree);
   
     var windDirection = changeDirection("wind" ,degree);
      var beaufort = toBeaufort(data.wind.speed);

     var arrowDirection = changeDirection("arrow", degree);
       $("#beaufort").html(beaufort); 

       var altText = "wind: "  + windDirection + ", " + beaufort + " Beaufort";
       $("#wind").attr("alt", altText);
    
       $("#arrow").css("transform", "rotate(" + arrowDirection + "deg)");
  console.log("showWeather is Celsius is: " + isCelsius);
  if(isCelsius){
      $("#tempBtn").html("To Fahrenheit");
    
  }  
}

function changeDirection(typeOfDirection, degree) {
  var array = [];
  if(typeOfDirection == "arrow") {
     array = [180, 225, 270, 315, 360, 45, 90, 135, 180];
  }
  else if(typeOfDirection == "wind") {
    array = ["North", "NorthEast", "East", "SouthEast", "South", "SouthWest", "West", "NorthWest", "North" ]; 
  }   
  var degr = degree;
  if (degree > 360) {
    degr = degree % 360;
  }
  var index = Math.round(degr / 45);
  return array[index];
}

/*
function toArrowDirection(degree) {
  var degrees =  [180, 225, 270, 315, 360, 45, 90, 135, 180];
  var degr = degree;
  if (degree > 360) {
    degr = degree % 360;
  }
  var index = Math.round(degr / 45);
  return degrees[index];
}

function toWindDirection(degree) {
  var directions = ["North", "NorthEast", "East", "SouthEast", "South", "SouthWest", "West", "NorthWest", "North" ]; 
  var degr = degree;
  if (degree > 360) {
    degr = degree % 360;
  }
  var index = Math.round(degr / 45);
  return directions[index];
}
*/

function between(x, min, max) {
    return x >= min && x <= max;
}

function toBeaufort(windSpeed) {
    var beaufort = 0;
    if (between(windSpeed, 0, 0.2)) {return beaufort = 0;}
    if (between(windSpeed, 0.3, 1.5)) {return beaufort = 1;}
    if (between(windSpeed, 1.6, 3.3)) {return beaufort = 2;}
    if (between(windSpeed, 3.4, 5.4)) {return beaufort = 3;}
    if (between(windSpeed, 5.5, 7.9)) {return beaufort = 4;}
    if (between(windSpeed, 8.0, 10.7)) {return beaufort = 5;}
    if (between(windSpeed, 10.8, 13.8)) {return beaufort = 6;}
    if (between(windSpeed, 13.9, 17.1)) {return beaufort = 7;}
    if (between(windSpeed, 17.2, 20.7)) {return beaufort = 8;}
    if (between(windSpeed, 20.8, 24.4)) {return beaufort = 9;}
    if (between(windSpeed, 24.5, 28.4)) {return beaufort = 10;}
    if (between(windSpeed, 28.5, 32.6)) {return beaufort = 11;}
    if (windSpeed > 32.7) {return beaufort = 12;}
}

var isCelsius = true; 

function toCelsius(degFahren) {
  var degCel = 5 / 9 * (degFahren - 32);
  return Math.round(degCel);
}

function toFahrenheit(degCel) {
  var degFahren = 9 / 5 * degCel + 32;
  return Math.round(degFahren);
}
function convert(converter, temperature) {  
  return converter(temperature);
}


function changeGrade(e) {
    // read temperature  
  var temp = $("#temperature").html();  
  if (isCelsius) {
		e.target.innerHTML = "To Celsius";
		isCelsius = false; 
    //console.log("isCelsius is: "  + isCelsius);
    var newTemp = convert(toFahrenheit, temp);
    $("#temperature").html(Math.round(newTemp));
  	$("#grade").html("F");
	}
	else {
		e.target.innerHTML = "To Fahrenheit";  
		isCelsius = true;
    //console.log("isCelsius is: "  + isCelsius);
    var newTemp = convert(toCelsius, temp);
    $("#temperature").html(newTemp);
    $("#grade").html("C");
	} 
}

//(function() {})();



