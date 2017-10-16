var mongoose    = require("mongoose");
var passportLocalMongoose     = require("passport-local-mongoose");

//create a user schema
var LikeSchema   = new mongoose.Schema({
      tag: String,
       size:Number,

});

//LikeSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Like',LikeSchema );
