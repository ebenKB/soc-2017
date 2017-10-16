var mongoose    = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");

//create a user schema
var UserSchema   = new mongoose.Schema({
  username:String,
  password:String,
  contact:String,
  email:String,
  image:String,
  friend_tag:String,
  isAdmin:Number,

  // friends:[
  //   {
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:"Friend"
  //   }
  // ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema );
