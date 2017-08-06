import express from 'express';
import dotenv from 'dotenv';
import Discord from 'discord.js';
import processMessage from './process-message';
import cron from 'cron';
import mongoDB from './db'
import birthday from './birthday';

const app = express();
dotenv.config();
const client = new Discord.Client();


const CronJob = cron.CronJob;

const bdReminder = new cron.CronJob({
  cronTime: '00 * * * * *',
  onTick: birthday.cronTick,
  start: false,
  timeZone: 'Europe/Kiev'
});

client.on('ready', () => {
  console.log('I am ready!', new Date());
  birthday._client = client;
  bdReminder.start();
});

client.on('message', message => {
  processMessage.process(message);
});

client.login(process.env.DISCORD_TOKEN);

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send('bd-bot page');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'))
});
