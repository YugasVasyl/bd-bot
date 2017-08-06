import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

const mongoDB = {
  connect: () => {
    return new Promise((res, rej) => {
      MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
        if (err) {
          console.log('err:', err);
          mongoDB._db.close();
          rej(err);
        } else {
          console.log("Connected correctly to server");
          mongoDB._db = db;
          res();
        }
      });
    });
  },

  findUser: (userId) => {
    return new Promise((res, rej) => {
      let collection = mongoDB._db.collection('users');
      collection.findOne({user_id: userId}, function(err, result) {
        if (err) {
          console.error(`Error finding user: ${id}, ${err}`);
          mongoDB._db.close();
          rej(err);
        } else {
          console.log("find user:", result);
          res(result);
        }
      });
    });
  },

  updateUser: (userData, newUser) => {
    return new Promise((res, rej) => {
      let collection = mongoDB._db.collection('users');
      if (newUser) {
        collection.insertOne(userData, (err, result) => {
          if (err) {
            console.error(`Error adding new user information: ${userData}, ${err}`);
            rej(err);
          } else {
            console.log('User information was added', result.results);
            res(result);
          }
          mongoDB._db.close();
        });
      } else {
        collection.findOneAndUpdate({user_id: userData.user_id}, {$set: userData}, (err, result) => {
          if (err) {
            console.error(`Error updating user information: ${userData}, ${err}`);
            rej(err);
          } else {
            console.log('User information was updated', result.results);
            res(result);
          }
          mongoDB._db.close();
        });
      }
    });
  }
};

export default mongoDB;