var mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
    name:String
});

module.exports = mongoose.model("Game",gameSchema );
