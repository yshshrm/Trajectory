const request = require('request');

request('http://api.geonames.org/wikipediaSearchJSON?q='+ encodeURIComponent(sortedCities[i].name)  +'&maxRows=10&username=yash4688', function (error, response, body) {
    bot.sendMessage(msg.chat.id, sortedCities[i].name + '\n' + JSON.parse(body).geonames[0].summary);
});