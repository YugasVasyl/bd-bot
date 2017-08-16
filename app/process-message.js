import mongoDB from './db';

const processMessage = {
  formatNumbers: (numbers) => {
    if (numbers) {
      numbers = numbers.slice(0, 3);
      for (let i = 0; i < 2; i++) {
        if (numbers[i] && numbers[i].length === 1) {
          numbers[i] = `0${numbers[i]}`;
        }
      }
      if (numbers[2] && numbers[2].length === 2) {
        let year = 19;
        if (+numbers[2] < 15) {
          year = 20;
        }
        numbers[2] = `${year}${numbers[2]}`;
      }
    }
    return numbers;
  },

  validateNumbers: (numbers) => {
    if (numbers) {
      console.log('numbers', numbers);
      if (numbers.length >= 2) {
        if (+numbers[0] <= 0 || +numbers[0] > 31) {
          return 'введена дата неправильна.';
        } else if (+numbers[1] <= 0 || +numbers[1] > 12) {
          return 'введений місяць неправильний.';
        } else if (numbers[2] && (!+numbers[2] || +numbers[2] < 1900 || +numbers[2] > (new Date).getFullYear())) {
          return 'введений рік неправильний.';
        }
      } else {
        return 'потрібно ввести дату та місяць народження окремо.';
      }
    } else {
      return 'я не знайшов жодної дати.';
    }
  },

  updateUserData: (userData) => {
    return mongoDB.connect().then(() => {
      return mongoDB.findUser(userData.user_id).then(oldUserData => {
        if (oldUserData) {
          if (!~oldUserData.server_ids.indexOf(userData.server_ids[0])) {
            oldUserData.server_ids.push(userData.server_ids[0]);
          }
          userData.server_ids = oldUserData.server_ids;
        }
        return mongoDB.updateUser(userData, !oldUserData);
      });
    });
  },

  process: (message) => {
    message.content = message.content.toLowerCase();
    let mess = message.content;
    if (!mess.indexOf('!bdbot') || !mess.indexOf('!bd-bot') || !mess.indexOf(`<@${process.env.SELF_ID}>`)) {
      let confusedPhrase = `Не напружуй мене просто так :confused:
Спробуй писати слова окремо, або щось розумніше, наприклад \`!bdbot help\``;

      let spaceIndex = mess.indexOf(' ');
      if (~spaceIndex) {
        mess = mess.substr(spaceIndex + 1);
      } else {
        return message.reply(confusedPhrase);
      }
      if (parseInt(mess, 10)) {
        return processMessage.addBirthday(message, mess);
      }
      return processMessage.showHelp(message);
    }
  },

  addBirthday: (message, mess) => {
    let userData = {
      user_id: message.author.id,
      username: message.author.username,
      server_ids: [message.channel.guild.id]
    };

    let numbers = mess.match(/\d+/g);
    numbers = processMessage.formatNumbers(numbers);
    let error = processMessage.validateNumbers(numbers);
    if (error) {
      error = `${error} Cпробуй, будь ласка, ще раз :slight_smile:`;
      message.reply(error);
    } else {
      userData.date = `${numbers[0]}.${numbers[1]}`;
      userData.year = numbers[2];
      processMessage.updateUserData(userData).then(() => {
        message.reply(`я успішно зберіг твій день народження: ${numbers[0]}.${numbers[1]}${numbers[2] ? '.' + numbers[2] : ''} 
Якщо він неправильний, введи його ще раз у форматі: дд.мм або дд.мм.рррр`);
      });
    }
  },

  showHelp: (message) => {
    message.reply(`Привіт! Я бот, який зберігає дні народження корисутвачів і вітає їх з цим святом у відповідний день :slight_smile:
Для того, щоб додати свій день народження, введи спеціальну команду **!bdbot дд.мм** або **!bdbot дд.мм.рррр**.
У разі виникнення питань та побажань, ти можеш звернутися до користувача \`<@${process.env.DRAKKA_ID}>\`.`);
  }
};

export default processMessage;