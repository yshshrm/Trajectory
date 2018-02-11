const Bot = require('node-telegram-bot-api');
const request = require('request');
const config = require('./../config.js');
const recastai = require('recastai');
const nearbyCities = require("nearby-cities");
const geodist = require('geodist');
var Scraper = require ('images-scraper')
, bing = new Scraper.Bing();

const client = new recastai.request(config.RECASTAI_TOKEN, 'en');  
const token = config.TELEGRAM_TOKEN;
const bot = new Bot(token, {polling: true});

function calc_dist(cost, days = 2) {
    console.log((cost - (10*days)) / 0.05);
    return (cost - (10*days)) / 0.07;
}

var message;

// bot.on('message', (event) => console.log(event.text.toString()));

bot.on('message', (msg) => {
    console.log(msg.text);
    client.analyseText(msg.text)
    .then(function(res) {
        console.log("Entities are ", res.raw.entities);
        if(res.intent()){
            if (res.intent().slug === 'greetings') {
                bot.sendMessage(msg.chat.id, 'Greetings from Valhalla! ');
                    // , { reply_markup: { keyboard: [['hi'], ['Bulk option']] }}
                // );    
            }
            else {
                if(!res.raw.entities.location && !res.raw.entities.money && !res.raw.entities.duration){
                    bot.sendMessage(msg.chat.id, "You can send me your budget, your location and the number of days you're free, I'll try my best to make an awesome short vacay for you"); 
                }
                else if(!res.raw.entities.location){
                    bot.sendMessage(msg.chat.id, 'From what city do you wish to travel, my lord?');
                }
                else if(!res.raw.entities.money){
                    bot.sendMessage(msg.chat.id, 'Tell me about the money you can spare!');
                }
                else if(res.raw.entities.location && res.raw.entities.money && res.raw.entities.duration){
                    let distance = calc_dist(res.raw.entities.money[0].dollars, res.raw.entities.duration[0].days);
                    let cities = nearbyCities({latitude: res.raw.entities.location[0].lat, longitude:  res.raw.entities.location[0].lng});
    
                    let sortedCities = cities.filter(city => city.population > 1000000 && city.country == 'IN' && geodist({lat: city.lat, lon: city.lon}, {lat: res.raw.entities.location[0].lat, lon: res.raw.entities.location[0].lng}, {exact: true, unit: 'km'}) < distance && geodist({lat: city.lat, lon: city.lon}, {lat: res.raw.entities.location[0].lat, lon: res.raw.entities.location[0].lng}, {exact: true, unit: 'km'}) > distance/2);
    
    
                    for (let i = 0; i < sortedCities.length; i++) { 
                        
                        console.log(sortedCities[i].name);

                        request('http://api.geonames.org/wikipediaSearchJSON?q='+ encodeURIComponent(sortedCities[i].name)  +'&maxRows=10&username=yash4688', function (error, response, body) {     
                            bing.list({
                                keyword: sortedCities[i].name,
                                num: 2,
                                detail: true
                                })
                                .then(function (res) {
                                     message = sortedCities[i].name + '\n' + JSON.parse(body).geonames[0].summary;

                                    request('https://apis.mapmyindia.com/advancedmaps/v1/7ng3rpngqc8sg2oaa53p97wjvchk32g9/nearby_search?lat=' + sortedCities[i].lat + '&lng=' + sortedCities[i].lon + '&code=TRMOTH&page=1', function (error, response, body) {
                                        // console.log(body);
                                         
                                         bot.sendMessage(msg.chat.id,  '\nPoints of Interests include  \n' + JSON.parse(body).results[0].poi + '\n' + JSON.parse(body).results[1].poi + '\n' + JSON.parse(body).results[2].poi);
                                    });

                                    console.log(message);

                                    bot.sendMessage(msg.chat.id,  message)
                                    .then(() => bot.sendPhoto(msg.chat.id, res[0].url))
                                }).catch(function(err) {
                                    console.log('err',err);
                                })
                        });

                        
                        
                    }

                }
                else {
                    bot.sendMessage(msg.chat.id, "How may I help you? "); 
                    bot.sendMessage(msg.chat.id, "You can send me your budget, your location and the number of days you're free, I'll try my best");               
                }
            }
        }

        else {
            if(!res.raw.entities.location && !res.raw.entities.money && !res.raw.entities.duration){
                bot.sendMessage(msg.chat.id, "You can send me your budget, your location and the number of days you're free, I'll try my best to make an awesome short vacay for you"); 
            }
            else if(!res.raw.entities.location){
                bot.sendMessage(msg.chat.id, 'From what city do you wish to travel, my lord?');
            }
            else if(!res.raw.entities.money){
                bot.sendMessage(msg.chat.id, 'Tell me about the money you can spare!');
            }
            else if(res.raw.entities.location && res.raw.entities.money && res.raw.entities.duration){
                let distance = calc_dist(res.raw.entities.money[0].dollars, res.raw.entities.duration[0].days);
                let cities = nearbyCities({latitude: res.raw.entities.location[0].lat, longitude:  res.raw.entities.location[0].lng});

                let sortedCities = cities.filter(city => city.population > 1000000 && city.country == 'IN' && geodist({lat: city.lat, lon: city.lon}, {lat: res.raw.entities.location[0].lat, lon: res.raw.entities.location[0].lng}, {exact: true, unit: 'km'}) < distance && geodist({lat: city.lat, lon: city.lon}, {lat: res.raw.entities.location[0].lat, lon: res.raw.entities.location[0].lng}, {exact: true, unit: 'km'}) > distance/2);


                for (let i = 0; i < sortedCities.length; i++) { 
                    
                    console.log(sortedCities[i].name);

                    request('http://api.geonames.org/wikipediaSearchJSON?q='+ encodeURIComponent(sortedCities[i].name)  +'&maxRows=10&username=yash4688', function (error, response, body) {     
                        bing.list({
                            keyword: sortedCities[i].name,
                            num: 2,
                            detail: true
                            })
                            .then(function (res) {
                                 message = sortedCities[i].name + '\n' + JSON.parse(body).geonames[0].summary;

                                request('https://apis.mapmyindia.com/advancedmaps/v1/7ng3rpngqc8sg2oaa53p97wjvchk32g9/nearby_search?lat=' + sortedCities[i].lat + '&lng=' + sortedCities[i].lon + '&code=TRMOTH&page=1', function (error, response, body) {
                                    // console.log(body);
                                    message += '\nPoints of Interests include  \n' + JSON.parse(body).results[0].poi + '\n' + JSON.parse(body).results[1].poi + '\n' + JSON.parse(body).results[2].poi;
                                });



                                bot.sendMessage(msg.chat.id,  message)
                                .then(() => bot.sendPhoto(msg.chat.id, res[0].url))
                            }).catch(function(err) {
                                console.log('err',err);
                            })
                    });

                    
                    
                }

            }
            else {
                bot.sendMessage(msg.chat.id, "How may I help you? "); 
                bot.sendMessage(msg.chat.id, "You can send me your budget, your location and the number of days you're free, I'll try my best");               
            }
        }
    }); 

});

