var express       = require ("express");
var router        = express.Router();
var Team         = require ("../models/team");
var  Game        = require ("../models/games");
var middleware  = require("../middleware");


//INDEX - show all the teams here
router.get("/", middleware.isLoggedIn,function(req,res){
  //find all  the game  categories
  Game.find({},function(err,foundGames){
    if(err){
      req.flash("error","An  error while loading the games")
    }else{
      //find all the teams and pass them to the page\
      Team.find({},function(err,foundTeam){
        if(err){
          console.log(err);
        }else{
          res.render("ADMIN/show",{teams:foundTeam,games:foundGames});
        }
      })
    }
  })
});

// CREATE - create new teams here
router.post("/",middleware.isAdmin,function(req,res){
  var team =  req.body.team;
  team.goal_for =0;
  team.goal_against=0;
  team.matches_played =0;
  team.matches_won=0;
  team.matches_lost=0;
  team.matches_draw=0;
  team.points=0;

  Team.create(team,function(err,newlyCreatedTeam){
    if(err){
      console.log(err);
    }else{
      console.log("a new team has been created");
      res.redirect("/teams");
    }
  });
});

//NEW  - show the form that will allow you to create a new team
router.get("/new",middleware.isAdmin,function(req,res){
  Game.find({},function(err,foundGames){
    if(err){
      req.flash("error","An error occurred loading games")
    }else{
        res.render("teams/new",{games:foundGames})
    }
  });
});

// //SHOW -- Shows oew infomarion about one team
// router.get("/:id",function(req,res){
//   res.send("show the infomation about a particular match here!!");
// });

//EDIT --  edit a team here-
router.get("/:id/edit",middleware.isAdmin,function(req,res){
  res.send("we will edit the match here!!")
});

//UPDATE -- find a particular team and then add points
router.put("/:id",middleware.isAdmin,function(req,res){

  //search for the team get the existing points
  Team.findById(req.params.id,function(err,foundTeam){
    if(err){
      req.flash("error",err);
    }else{
      var points= foundTeam.points;
      //setting the initial parameters
      var matches_played=foundTeam.matches_played;
      var matches_won=foundTeam.matches_won;
      var matches_lost=foundTeam.matches_lost;
      var matches_draw=foundTeam.matches_draw;
      var goal_for = foundTeam.goal_for;
      var goal_against=foundTeam.goal_against;

       //check if there is any value provided
       req.check("points").notEmpty(points);
       var errors = req.validationErrors();
       if(errors){
         req.flash("error","You did not provide a valid input")
         res.redirect("/teams");
       }else{
         //if the user presses the button to add new points
         if(req.body.hasOwnProperty("addNewPoints")){
           //set the value for the points and add to the new object
           points=(parseInt(points)) + (parseInt (req.body.points));

             //check if the team won, lost or drew
             if(parseInt(req.body.points)==1){
               matches_draw=foundTeam.matches_draw+ 1;
               matches_played = foundTeam.matches_played + 1

             }else if(parseInt(req.body.points)==3){
                matches_played = foundTeam.matches_played + 1
                matches_won = foundTeam.matches_won+ 1;
             }else if(parseInt(req.body.points==0)){
               //it means the team has localhost
               matches_played = foundTeam.matches_played + 1
               matches_lost = foundTeam.matches_lost+ 1;
             }
         }else if(req.body.hasOwnProperty("removePoints")){
           points=(parseInt(points)) - (parseInt (req.body.points));
         }else if(req.body.hasOwnProperty("goalsFor")){
           goal_for=goal_for + parseInt(req.body.points);
         }else if(req.body.hasOwnProperty("goalsAgainst")){
           goal_against= goal_against + parseInt(req.body.points)
         }else if(req.body.hasOwnProperty("subgoalsFor")){
            goal_for=goal_for - parseInt(req.body.points);
         }else if(req.body.hasOwnProperty("subgoalsAgaints")){
            goal_against=goal_against - parseInt(req.body.points);
         }

         var newTeam={
           points:points,
           matches_won : matches_won,
           matches_draw:matches_draw,
           matches_lost:matches_lost,
           matches_played : matches_played,
           goal_for:goal_for,
           goal_against:goal_against
         };
         //now update the team records
         foundTeam.update(newTeam,function(err,updatedTeam){
           if(err){
             req.flash("error","An error occured with the database");
           }else{
             res.redirect("/teams");
           }
         });
       }

    }
  })
});

//DESTROY -- delete a team here
router.delete("/:id",middleware.isAdmin,function(req,res){
 Team.findByIdAndRemove(req.params.id,function(err){
   if(err){
     req.flash("error","Colud not delete team")
     res.redirect("back");
   }else{
     res.redirect("/teams");
   }
 })
});

module.exports = router;
