var mongoose = require("mongoose");

var gallerySchema = new mongoose.Schema({
  image:String,
  description:String,
  author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
  }
});

module.exports = mongoose.model("Gallery",gallerySchema );
