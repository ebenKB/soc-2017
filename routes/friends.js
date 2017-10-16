
var express     = require("express");
var router      = express.Router();
var Post        = require("../models/posts");
var User        = require("../models/user");
var middleware  = require("../middleware");
var Friend      = require ("../models/friends");

//FRIENDS NEW - show all users and select who you want to make your friend
router.get("/", middleware.isLoggedIn,function(req,res){
  User.find({},function(err,foundUser){
    if(err){
      res.redirect("back");
    }else{
      res.render("friends/new",{user:foundUser})
    }
  });
});

router.get("/:user_id",function(req,res){
  //find the user with the id
  User.findById(req.params.user_id).populate("comments").exec(function(err,user){
    if(err){
      console.log(err)
    }else{
      //find the friends of the user
      res.render("friends/show",{user:user})
    }
  });
//   //res.send("we are creating new friends here")
});

// FRIENDS CREATE -- create a new friend and add him to a user
router.post("/:id/new",function(req,res){
  console.log("this is id:"+req.params.id);

  //find the user who wants to create a friend
  User.findById(req.params.id,function(err,user){
    if(err){
      console.log(err)
    }else{
      console.log("this is the user who wants a friend"+user)

      var friend = {tag: req.user._id};

      Friend.create(friend,function(err,newfriend){
        if(err){
          console.log(err)
        }else{
        //  req.user_id
          newfriend.save();
          user.friends.push(newfriend);
          user.save();
          //res.redirect("/friends");
          res.send("created a new friend");
        }
      });
    }
  });

});

module.exports=router;
