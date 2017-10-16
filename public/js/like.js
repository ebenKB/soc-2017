//require module and libraries
var express = require("express");
// var express = require("express");
// var router  = express.Router({mergeParams: true});
// var Campground = require("../models/campground");
// var Comment = require("../models/comment");

function addNewlike(){

Post.findById(req.body.id,function(err,foundPost){
  if(err){
    console.log(err)
  }else{
    console.log(foundPost)
  }
  })
    alert('kiiiiiiiiiiii');
}
