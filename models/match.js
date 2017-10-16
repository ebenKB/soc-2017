var mongoose    = require("mongoose");

//create a user schema
var matchSchema   = new mongoose.Schema({
  author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
    },
    venue:String,
    time :String,
    status: Number,
    category:String,

    // the team that is playing home
    homeTeam:String,
    // homeTeam:[
    //   {
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Team"
    //   }
    // ],

    //the team that is playing away.
    awayTeam:String,
    // awayTeam:[
    //   {
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Team"
    //   }
    // ]
});



module.exports = mongoose.model("Match",matchSchema );
