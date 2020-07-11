const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI'); //this is the url when create an acount in mongodbAtlas-->cluster we made befor and the password between <> must be the Database user's password we made befor :just go to your mango db dashbord-->select database Access at left side--> press edit infront of user you made befor and change password if you dont remember what was it and then clean <Password> in uri and put your pasword there.

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    //Exit processwith failure
    process.exit(1);
  }
};

module.exports = connectDB;
