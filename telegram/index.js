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

function calc_dist(cost, days) {
    console.log((cost - (10*days)) / 0.05);
    return (cost - (10*days)) / 0.07;
}

// bot.on('message', (event) => console.log(event.text.toString()));

bot.on('message', (msg) => {
    console.log(msg.text);
    client.analyseText(msg.text)
    .then(function(res) {
        console.log("Entities are ", res.raw.entities);

        if(res.intent()){
            if (res.intent().slug === 'greetings') {
                bot.sendMessage(msg.chat.id, 'Greetings from Valhalla! Any specific budget?');
                // const url = 'https://telegram.org/img/t_logo.png';
                // bot.sendPhoto(msg.chat.id, url);
                    // , { reply_markup: { keyboard: [['hi'], ['Bulk option']] }}
                // );    
            }
            else {
                if(!res.raw.entities.location){
                    bot.sendMessage(msg.chat.id, 'From what city do you wish to travel, my lord?');
                }
                if(!res.raw.entities.money){
                    bot.sendMessage(msg.chat.id, 'How much money have you in your pocketses?');
                }
                if(res.raw.entities.location && res.raw.entities.money && res.raw.entities.duration){
                    let distance = calc_dist(res.raw.entities.money[0].dollars, res.raw.entities.duration[0].days);
                    let cities = nearbyCities({latitude: res.raw.entities.location[0].lat, longitude:  res.raw.entities.location[0].lng});
                    console.log(cities);

                }
            }
        }

        else {
            if(!res.raw.entities.location){
                bot.sendMessage(msg.chat.id, 'From what city do you wish to travel, my lord?');
            }
            if(!res.raw.entities.money){
                bot.sendMessage(msg.chat.id, 'How much money have you in your pocketses?');
            }
            if(res.raw.entities.location && res.raw.entities.money && res.raw.entities.duration){
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
                            bot.sendMessage(msg.chat.id,  "-------------------------\n" + sortedCities[i].name + '\n' + JSON.parse(body).geonames[0].summary)
                            .then(() => bot.sendPhoto(msg.chat.id, res[0].url))
                            .then(() => bot.sendPhoto(msg.chat.id, res[1].url))
                        }).catch(function(err) {
                            console.log('err',err);
                        })
                    });
                    
                }
                // bot.sendMessage(msg.chat.id, sortedCities[0].name);

            }
        }
    }); 

});

