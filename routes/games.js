var express = require("express");
var router  = express.Router();
var mongoose =require("mongoose");
var Game = require("../models/games");
var middleware = require("../middleware");

//INDEX -- show all gallery
router.get("/",function(req,res){
  //get all the gallery from the db
  Game.find({},function(err,allGallery){
    if(err){
      console.log(err)
    }else{
      res.render("game/show",{gallery:allGallery});
    }
  });
});

//CREATE -- add a new gallery
router.post("/",middleware.isLoggedIn,function(req,res){
  var category = req.body.category;
  var game = {name:category}

  Game.create(game,function(err,createdGame){
    if(err){
      req.flash("error","An error occured while creating the game");
    }else{
      req.flash("success","Added a new Game")
      res.redirect("/teams/new");
    }
  })
});
//SHOW - show the form to add a new game
router.get("/new",middleware.isLoggedIn,function(req,res){
  res.render("game/new");
});

module.exports = router;
