
var mongoose    = require("mongoose");
//create a user schema
var friendSchema   = new mongoose.Schema({
  //a comment has an Author
  //a friend has a friend who is a user and that friend has a name
  //friends will be linked with their id's
  tag:String
        // tag: {
        //     id:{
        //       type: mongoose.Schema.Types.ObjectId,
        //       ref: "User"
        //     }
        // }

});

module.exports = mongoose.model("Friend",friendSchema );
