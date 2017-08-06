import express from 'express';
import dotenv from 'dotenv';
const app = express();
dotenv.config();

import Discord from 'discord.js';
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  console.log('message', message);
  if (!message.content.indexOf('!bdbot')) {
    message.reply('pong');
    console.log('pong');
  }
});

client.login(process.env.DISCORD_TOKEN);

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send('BDbot');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
