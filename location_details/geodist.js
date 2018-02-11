const nearbyCities = require("nearby-cities")
const cities = nearbyCities({latitude: 28.7, longitude: 77.1})

const geodist = require('geodist');

var mcities = cities.filter(city => city.population > 1000000 && city.country == 'IN');
var dist = geodist({lat: mcities[1].lat, lon: mcities[2].lat}, {lat: mcities[0].lat, lon: mcities[0].lat}, {exact: true, unit: 'km'}) 

console.log(mcities[0], mcities[1], dist);