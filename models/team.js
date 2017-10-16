
var mongoose    = require("mongoose");


//create a user schema
var teamSchema   = new mongoose.Schema({
  //a comment has an Author
    name:String,
    coachName:String,
    category:String,
    goal_for:Number,
    goal_against:Number,
    matches_played:Number,
    matches_won:Number,
    matches_lost:Number,
    matches_draw:Number,
    points:Number,
    match_id:[]
});

module.exports = mongoose.model("Team",teamSchema );
