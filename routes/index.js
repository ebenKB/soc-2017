//require module and libraries
var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user"),
    middleware = require("../middleware");

  //root router
  router.get("/",function(req,res){
    res.render("index");

  });

  //register route
  router.get("/register",function(req,res){
    res.render("register");
  });

  //handle the register logic i.e register a new user
  router.post("/register",function(req,res){
      //check if the fields are valid
      var imageName="login.png";
      var image="";
      req.checkBody('username', 'Invalid name').isAlpha();
      req.check("email","Invalid email provided").isEmail;
      req.check("password","Password is invalid").isLength({min:4}).equals(req.body.password2);
      var errors = req.validationErrors();

      if(errors){
        req.session.errors = errors;
        req.flash("error","Password should be 4 letters or more. Please provide data for the required fields.")
        res.redirect("/register");
      }else{
             //check if the image is not null
             if(req.files.image){
               imageName = req.files.image.name;
               image=req.files.image;
               //move the image to the specified folder
               image.mv("public/images/"+imageName,function(err){
                if(err){
                  req.flash("error",err.message);
                  res.redirect("/register");
                }
              });
             }
        var newUser = new User({username: req.body.username,contact:req.body.phone,email:req.body.email,isAdmin:0,image:imageName});
        User.register(newUser, req.body.password,function(err, user){
            if(err){
                console.log(err);
                return res.render("register");
            }
            passport.authenticate("local")(req, res, function(){
               res.redirect("/menu");
            });
        });
      }
  });

  //show the login form
  router.get("/login",function(req,res){
    res.render("login")
  });

// router.get("/menu",function(req,res){
//   res.render("menu");
// })
  //show the menu
  router.get("/menu",middleware.isLoggedIn,function(req,res){
    res.render("menu");
  });

  //handle the login logic
  router.post("/login", passport.authenticate("local",
    {
      successRedirect:"/menu",
      failureRedirect:"/login"
  }),function(req,res){
  });

//handle logout
router.get("/logout",function(req,res){
  var user=req.user.username;
  req.logout(); //logs out the current user
  req.flash("success", user+" "+ "we logged you out!");
  res.redirect("/");
});

  module.exports = router;
