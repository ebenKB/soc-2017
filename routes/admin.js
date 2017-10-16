
var express       = require ("express");
var router        = express.Router();
var Match         = require ("../models/match");
var Team          = require ("../models/team");
var middleware  = require("../middleware");


router.get("/",middleware.isAdmin,function(req,res){
  Match.find({},function(err,foundMatch){
    if(err){
      console.log(err);
    }else{
      res.render("ADMIN/menu",{match :foundMatch})
    }
  });
});

//INDEX - show all the matches here and delete the ones you want
router.get("/deleteMatch",middleware.isAdmin,function(req,res){
  Match.find({},function(err,foundMatch){
    if(err){
      console.log(err);
    }else{
      res.render("ADMIN/showAllMatches",{match :foundMatch})
    }
  });
});

router.get("/leagueTable",middleware.isLoggedIn,function(req,res){
  //search all teams with their data
  Team.find({},function(err,foundTeams){
    if(err){
      console.log(err);
    }else{
      res.render("matches/leagueTable",{teams:foundTeams})
    }
  });
});
// CREATE - create new matches here
router.post("/",middleware.isLoggedIn,function(req,res){
  var match = req.body.match;
  match.status =0;
  if(match.homeTeam ===match.awayTeam){
    console.log("Home and Away Teams are the same")
  }else {
      //create an author
      var author = {id:req.user._id,username:req.user.username};

    //create a match
    Match.create(match,function(err,newlyCreatedMatch){
        if(err){
          console.log(err)
        }else{
          newlyCreatedMatch.author= author;
          newlyCreatedMatch.save();
          res.redirect("/match");
        }
    });
  }
});

//NEW  - show the form that will allow you to crate a new match
router.get("/new",middleware.isLoggedIn,function(req,res){
  Team.find({},function(err,foundTeam){
    if(err){
      console.log(err);
    }else{
      var teamArray =[];
      teamArray=foundTeam;
      res.render("matches/new",{teams:foundTeam,teamArray:teamArray})
    }
  });
});

//show the form to add a new league table
router.get("/leagueTable/new",function(req,res){
    res.render("/matches/newLeagueTable");
});
//SHOW -- Shows more infomarion about one mactch
router.get("/:id",middleware.isLoggedIn,function(req,res){
  Match.findById(req.params.id, (err, foundMatch) => {
    console.log("this is the id:"+req.params.id);
    if(err){
      console.log(err)
    }else{
      res.render("matches/showSingleMatch",{match:foundMatch});
    }
  });
});

//EDIT --  show the form to edit a match here- find the match and parse it to the form
router.get("/:id/edit",middleware.checkMatchOwnsership,function(req,res){
  Match.findById(req.params.id,function(err,foundMatch){
    if(err){
      console.log(err)
    }else{
      //search all teams and pass it on
      Team.find({},function(err,foundTeam){
        if(err){
          console.log(err)
        }else{
          res.render("matches/edit",{match:foundMatch,teams:foundTeam});
        }
      })
    }

  });
});

//UPDATE -- find a particular match and then update the match
router.put("/:id",middleware.checkMatchOwnsership,function(req,res){
  Match.findByIdAndUpdate(req.params.id,req.body.match,function(err,updatedMatch){
      if(err){
        res.redirect("/match");
      }else{
        //redirect somewhere
        res.redirect("/match/"+req.params.id);
      }
  });
});

//DESTROY -- delete a match here
router.delete("/:id",middleware.checkMatchOwnsership,function(req,res){
  Match.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/match");
    }else{
      console.log("match removed")
      res.redirect("/match");
    }
  })
});

module.exports = router;
