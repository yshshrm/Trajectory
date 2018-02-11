# Trajectory
It is a Telegram and Messenger bot (awaiting approval for Messenger).

### What's It About?
* Takes your budget into consideration and locates the best fit places for you considering length of stay, travel cost, hotel costs, season of booking etc.
* Analyzes your FaceBook and Twitter profiles to get a hint of your personality 
* A much cooler interface (Telegram or Messenger!) which won’t get bored no matter how many times you query it, and with as many parameters as you want!

### Deployment
Create a `config.js` file in the root which contains the tokens `RECASTAI_TOKEN`, `TELEGRAM_TOKEN` and `FACEBOOK_ACCESS_TOKEN`.

Deploy the Telegram bot using `node telegram/index.js`
Deploy the Messenger bot using ngrok

### Datasets Used
* Open Data Government to calculate the average expenditure by every traveller (in India). This includes all costs incurred like housing, adventure sports etc
* MMDS Project for personality insights.

### Open Source Projects/ APIs Used
* MapMyIndia to get points of interest
* Geodist to get geographical information
* Telegram-Bot-Api to connect with Telegram

