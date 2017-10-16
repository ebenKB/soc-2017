var mongoose    = require("mongoose");


//create a user schema
var commentSchema   = new mongoose.Schema({
  //a comment has an Author
  text:String,

  author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
  }
});



module.exports = mongoose.model("Comment",commentSchema );
