const mongoose = require("mongoose");

const UserModel = mongoose.Schema({
  nome: String,
  email: String,
  password: String 
});

module.exports = mongoose.model("Users", UserModel);