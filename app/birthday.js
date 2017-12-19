import mongoDB from './db';
import dotenv from 'dotenv';
import adPhrasesData from './assets/ad-phrases.json';
import imagesData from './assets/images.json';

dotenv.config();

function random(len) {
  return Math.floor(Math.random() * len);
}

const birthday = {
  cronTick: () => {
    console.log('cron\'s tick was runned!!');
    mongoDB.connect().then(() => {
      let timezoneShift = -3;
      if (+process.env.TIMEZONE_SHIFT !== undefined) {
        timezoneShift = +process.env.TIMEZONE_SHIFT;
      }
      let today = new Date(+ new Date + timezoneShift * 60 * 60 * 1000);
      let day = today.getDate();
      day = day < 10 ? `0${day}` : day;
      let month = today.getMonth() + 1;
      month = month < 10 ? `0${month}` : month;
      let year = today.getFullYear();
      let search = `${day}.${month}`;
      mongoDB.getBirthdays(search).then(users => {
        let servers = {};
        users.forEach(user => {
          user.server_ids.forEach(id => {
            servers[id] = servers[id] || [];
            servers[id].push(user);
          });
        });

        Object.keys(servers).forEach(serverId => {
          let usersText = '';
          servers[serverId].forEach(user => {
            if (usersText.length) {
              usersText = `${usersText}, `;
            }
            usersText = `<@${user.user_id}> `;
            if (user.year) {
              usersText = ` ${usersText}(${year - user.year}р.)`;
            }
          });
          let to = 'Тобі';
          if (servers[serverId] > 1) {
            to = 'Вам';
          }

          let images = imagesData.images;
          let greeting = `Від імені всієї української геймер-спільноти урочисто вітаю з днем народження ${usersText}. 
Бажаю ${to} набитого гаманця в Steam, потужного ПК (або консоль) та купу приємних вражень від ігор!!!\n
${images[random(images.length)]} :wink:`;

          let guild = birthday._client.guilds.get(serverId);
          if (guild) {
            let channels = guild.channels;
            let generalName = process.env.CHANNEL_GENERAL || 'general';
            let generalKey = channels.findKey('name', generalName) || channels.firstKey();
            channels.get(generalKey).send(greeting);
          }
        });
      });
    });
  },

  showAd: () => {
    mongoDB.connect().then(() => {
      return mongoDB.getServers().then(servers => {
        servers.forEach(server => {
          let guild = birthday._client.guilds.get(server.id);
          if (guild) {
            let channels = guild.channels;
            let botCommandName = process.env.CHANNEL_BOT_COMMANDS || 'bot_commands';
            let botCommandsKey = channels.findKey('name', botCommandName);
            let botCommandsChannel = channels.get(botCommandsKey);
            if (botCommandsChannel) {
              botCommandsChannel.send(adPhrasesData.adPhrases[random(adPhrasesData.adPhrases.length)]);
            }
          }
        });
      });
    });
  }

};

export default birthday;