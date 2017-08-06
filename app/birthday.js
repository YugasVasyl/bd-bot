import mongoDB from './db';

const birthday = {
  cronTick: () => {
    console.log('cron\'s tick was runned!!');
    mongoDB.connect().then(() => {
      mongoDB.getServers().then(servers => {
        servers.forEach(server => {
          let guild = birthday._client.guilds.get(server.id);
          let channels = guild.channels;
          let generalKey = channels.findKey('name', 'general') || channels.firstKey();
          channels.get(generalKey).send('З ДН кароч :upside_down:');
        });
      });
    });
  }
};

export default birthday;