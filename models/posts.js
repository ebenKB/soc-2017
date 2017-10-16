var mongoose    = require("mongoose");
var passportLocalMongoose     = require("passport-local-mongoose");

//create a user schema
var PostSchema   = new mongoose.Schema({
  title:String,
  description:String,
  image:String,
  likeTag:Number,
  likeContainer:[],
  //a post has an Author
  author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
  },

  //a post has likes
  likes: [
     {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like"
     }
  ],

  //a post has comments
  comments:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Comment"
    }
  ]
});

//PostSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Post",PostSchema );
