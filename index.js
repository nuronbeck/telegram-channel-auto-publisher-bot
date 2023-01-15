require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { Telegraf } = require("telegraf");
// const schedule = require('node-schedule');
const axios = require('axios');

// Express server
const app = express();
const port = process.env.PORT || 3000;

// Express server middlewares
app.use(cors({ origin: '*' }));

// Settings
const botToken = process.env.BOT_TOKEN;
const channel = `@${process.env.CHANNEL_NAME}`;

// Schedule rule
// const scheduleRule = new schedule.RecurrenceRule();
// scheduleRule.hour = 2;
// scheduleRule.minute = 41;
// scheduleRule.tz = 'Asia/Tashkent';

// Telegram bot instance
const bot = new Telegraf(botToken);

async function autopostTelegramChannel () {
  console.log('Started autoposting...');

  const { data: ipakYoliBankRate = {} } = await axios.get('https://ipak-yoli-bank-exchange-rates.onrender.com/rate');
  
  const ipakYoliBankRateMarkup =
    `<strong>Ipak Yöli Bank:</strong>\n` +
    `(${ipakYoliBankRate?.title || 'NULL'})\n\n` +
    `<i>💵 Покупка:</i> ${ipakYoliBankRate?.buy || 'NULL'} сум\n` +
    `<i>💸 Продажа:</i> ${ipakYoliBankRate?.sell || 'NULL'} сум\n`;

  console.log(ipakYoliBankRateMarkup);

  return bot.telegram.sendMessage(
    channel, ipakYoliBankRateMarkup, { parse_mode: 'HTML'}
  );
}

// const job = schedule.scheduleJob(scheduleRule, async function(){
//   console.log("Schedule job has been started...");
//   await autopostTelegramChannel();
//   console.log("Schedule job is finished!");
// });


app.post('/publish-post', (req, res) => {
  autopostTelegramChannel();
  
  res.status(200).send({ message: 'Ok' });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})