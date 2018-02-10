const recastai = require('recastai');
const config = require('./../config.js');

const client = new recastai.request(config.RECASTAI_TOKEN, 'en');

var text = "hello";

client.analyseText(text)
  .then(function(res) {
    console.log("Entities are ", res.raw.entities);
    if (res.intent()) { 
        console.log('Intent: ', res.intent().slug) 
        if (res.intent().slug === 'greetings') {
            console.log('Greetings from Valhalla!');
        }
    }
  })