require('dotenv').config();
const { Telegraf } = require("telegraf");
const schedule = require('node-schedule');
const axios = require('axios');

// Settings
const botToken = process.env.BOT_TOKEN;
const channel = `@${process.env.CHANNEL_NAME}`;

// Schedule rule
const scheduleRule = new schedule.RecurrenceRule();
scheduleRule.hour = 10;
scheduleRule.minute = 0;
scheduleRule.tz = 'Asia/Tashkent';

// Telegram bot instance
const bot = new Telegraf(botToken);

const job = schedule.scheduleJob(scheduleRule, async function(){
  console.log("Schedule job has been started...");

  const { data: ipakYoliBankRate = {} } = await axios.get('https://ipak-yoli-bank-exchange-rates.onrender.com/rate');
  
  const ipakYoliBankRateMarkup =
    `<strong>Ipak Yöli Bank:</strong>\n` +
    `(${ipakYoliBankRate?.title || 'NULL'})\n\n` +
    `<i>💵 Покупка:</i> ${ipakYoliBankRate?.buy || 'NULL'} сум\n` +
    `<i>💸 Продажа:</i> ${ipakYoliBankRate?.sell || 'NULL'} сум\n`;

  console.log(ipakYoliBankRateMarkup);

  bot.telegram.sendMessage(
    channel, ipakYoliBankRateMarkup, { parse_mode: 'HTML'}
  );

  console.log("Schedule job is finished!");
});