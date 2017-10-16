var mongoose = require("mongoose");
var Post = require("../models/posts");
var Like = require("../models/likes");
var Match = require("../models/match");

//define a middleware object that will contain all the middleware functions
var middlewareObj = {};

//check if the user is Logged in or not
middlewareObj.isLoggedIn = function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error","You are not Logged in. Please log in");
  res.redirect("/login");
}

//validate the user email
middlewareObj.isAdmin = function(req,res,next){
  if(req.user){
    if(req.isAuthenticated && req.user.isAdmin==1){
      console.log("You are an admin");
      next();
    }else{
      req.flash("error","You have to log in as Administrator to do this.")
      res.redirect("/menu");
    }
  } else{
    req.flash("error","You need Administrator Permission to do this");
    res.redirect("/menu");
  }
}

//check if the user is an adminRoute

//check the owner of the file
middlewareObj.checkPostOwnership = function(req,res,next){
  if(req.isAuthenticated()){
    Post.findById(req.params.id,function(err, foundPost){
      if(err){
        res.redirect("back");
      }else{
        if(foundPost.author.id.equals(req.user._id) || req.user.isAdmin==1){
          next();
        }else{
          req.flash("error","Access denied! You cannot delete this post!");
          res.redirect("back");
        }
      }
    })
  }else{
    //send the user back to where they from
    res.redirect("back");
  }
}

//check match ownerShip
middlewareObj.checkMatchOwnsership = function(req,res,next){
  if(req.isAuthenticated() || req.user.isAdmin==1){
    Match.findById(req.params.id,function(err,foundMatch){
      if(err){
        res.redirect("back");
      }else {
        if(foundMatch.author){
            if(foundMatch.author.id.equals(req.user._id)){
                next();
            }
        }else{
          req.flash("error","Access denied! You cannot delete this match!");
          res.redirect("back");
        }
      }
    });
  }
}
// middlewareObj.check_if_empty(text)=function(req,res,next){
//   if(text.length <1){
//     console.log("You provided an empty text field");
//     res.redirect("back");
//   }else {
//     next();
//   }
// }

function check_if_empty(text){
  if(text.length <1){
    return false
  }
}

// middlewareObj.loadData = function(req,res,next){
//   Post.find({}, (err, foundPost) => {
//     if (err) {
//       console.log(err);
//     } else {
//         next();
//     }
//   });
// }
middlewareObj.likePost = function(req,res,next){
    Post.findById(req.params.id). populate("likes").exec(function(err, foundPost){
      if(err){
        console.log(err);
      }else{
        if(!foundPost.likes || ! foundPost.likes._id.equals(req.params.id)){
          var like ={};
          Like.create(like,function(req,res){
            if(err){
              console.log(err)
            }else{
              like.author.id=req.user._id;
              like.author.username = req.user.username;
              like.save();
              foundPost.likes.push(like);
              foundPost.save();
              console.log("In the middle ware, we found a post with like"+ foundPost.likes.username);
              next();
            }
          });
        }else{
          console.log("you already have a like for this post");
        }
      }
    });
  }

  middlewareObj.alert =function(req,res,next){
    console.log("we are in the alert of the middlewareObj");
    next();
  }
module.exports = middlewareObj;
