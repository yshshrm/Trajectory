const Bot = require('node-telegram-bot-api');
const request = require('request');
const config = require('./../config.js');
const recastai = require('recastai');

const client = new recastai.request(config.RECASTAI_TOKEN, 'en');  
const token = config.TELEGRAM_TOKEN;
const bot = new Bot(token, {polling: true});

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
                    bot.sendMessage(msg.chat.id, 'From what city do you wish to travel, my lords?');
                }
                if(!res.raw.entities.money){
                    bot.sendMessage(msg.chat.id, 'How much money have you in your pocketses?');
                }
            }
        }

        else {
            if(!res.raw.entities.location){
                bot.sendMessage(msg.chat.id, 'From what city do you wish to travel, my lords?')
            }
            console.log(res.raw.entities);
            bot.sendMessage(msg.chat.id, res.raw.entities.money[0].amount)
        }
    }); 

});

