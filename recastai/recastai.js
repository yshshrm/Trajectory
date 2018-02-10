const recastai = require('recastai');
const config = require('./../config.js');

const client = new recastai.request(config.RECASTAI_TOKEN, 'en');

var myResponse = "";

function getResponse(text){
    client.analyseText(text)
    .then(function(res) {
      console.log("Entities are ", res.raw.entities);
      if (res.intent()) { 
          console.log('Intent: ', res.intent().slug) 
          if (res.intent().slug === 'greetings') {
            myResponse = 'Greetings from Valhalla!';      
          }
      }
      return myResponse;
    });
    
}

module.exports = {getResponse};
