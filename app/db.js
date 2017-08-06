import mongodb from 'mongodb';
import dotenv from 'dotenv';

const MongoClient = mongodb.MongoClient;
dotenv.config();
const url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const dbConnect = {
  connect: () => {
    MongoClient.connect(url, function(err, db) {
      console.log('zxc');
      if (err) {
        console.log('err:', err);
      } else {
        console.log("Connected correctly to server");
      }
      db.close();
    });
  }
};

export default dbConnect;