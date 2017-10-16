var express = require("express");
var router  = express.Router();
var mongoose =require("mongoose");
var Gallery = require("../models/gallery");
var middleware = require("../middleware");

//INDEX -- show all gallery
router.get("/",function(req,res){
  //get all the gallery from the db
  Gallery.find({},function(err,allGallery){
    if(err){
      console.log(err)
    }else{
      res.render("gallery/showAllGallery",{gallery:allGallery});
    }
  });
});

//CREATE -- add a new gallery
router.post("/",middleware.isLoggedIn,function(req,res){
  var username = req.user.username;
  var description = req.body.description;
  var id = req.user._id;
  //var image = req.body.image
  var image = req.files.image;
  var imageName =image.name;


  //check if the file is not empty
  //req.check("req.body.image","You didn't select any image").is
  var author = {
    id:id,
    username:username
  }
  image.mv("public/images/"+imageName,function(err){
      if(err){
        console.log("an error occured while moving the image")
      }else{
          console.log("this is the image name:"+imageName)
        var newGallery =  {image:imageName,author:author,description:description}
        Gallery.create(newGallery,function(err,newlyCreatedGallery){
          if(err){
            console.log(err)
          }else{
          //  res.render("gallery/showAllGallery",{gallery:newlyCreatedGallery});
          res.redirect("/gallery")
          }
        });
      }
  });
});

//SHOW - show the form to add a new gallery
router.get("/new",middleware.isLoggedIn,function(req,res){
  res.render("gallery/new");
})

module.exports = router;
