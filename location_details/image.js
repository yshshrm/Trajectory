var Scraper = require ('images-scraper')
, bing = new Scraper.Bing();

bing.list({
  keyword: 'banana',
  num: 10,
  detail: true
})
.then(function (res) {
  console.log('first 10 results from bing', res);
}).catch(function(err) {
  console.log('err',err);
})