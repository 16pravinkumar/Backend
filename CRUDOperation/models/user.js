const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/UsersDatatabase`);

const userModel = mongoose.Schema({
  name: String,
  email: String,
  imgUrl : String,
})


module.exports = mongoose.model('user',userModel)