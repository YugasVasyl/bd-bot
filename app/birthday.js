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
Бажаю ${to} набитого гаманця в Steam, відкриття всіх досягнень та купу приємних вражень від ігор!!!\n
${images[random(images.length)]} :wink:`;

          let guild = birthday._client.guilds.get(serverId);
          if (guild) {
            let channels = guild.channels;
            let generalKey = channels.findKey('name', 'general') || channels.firstKey();
            channels.get(generalKey).send(greeting);
          }
        });
      });
    });
  },

  popularisation: () => {

  }
};

export default birthday;