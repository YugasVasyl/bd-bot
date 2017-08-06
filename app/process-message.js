const processMessage = {
  formatNumbers: (numbers) => {
    if (numbers) {
      for (let i = 0; i < 2; i++) {
        if (numbers[i] && numbers[i].length === 1) {
          numbers[i] = `0${numbers[i]}`;
        }
      }
      if (numbers[2] && numbers[i].length === 2) {
        let year = 19;
        if (+numbers[2] < 15) {
          year = 20;
        }
        numbers[2] = `${year}${numbers[2]}`;
      }
    }
  },

  validateNumbers: (numbers) => {
    if (numbers) {
      if (numbers.length >= 2) {
        if (+numbers[0] <= 0 || +numbers[i] > 31) {
          return 'Введена дана неправильна.';
        } else if (+numbers[1] <= 0 || +numbers[1] > 12) {
          return 'Введений иісяць неправильний.';
        } else if (!+numbers[2]) {
          return 'Введений рік неправильний.';
        }
      } else {
        return 'Потрібно ввести дату та місяць народження окремо.';
      }
    } else {
      return 'Я не знайшов жодної дати.';
    }
  },

  process: (messsage) => {
    let numbers = message.content.match(/\d+/g);
    this.formatNumbers(numbers);
    let error = this.validateNumbers(numbers);
    if (error) {
      // return error message!
    } else {

    }
    // , спробуй, будь ласка, ще раз :slight_smile:'
  }

};

export default processMessage;