//requring defined modules and installed libraries
var express            = require("express"),
    app                = express(),
    path               = require('path'),
    fileUpload         = require("express-fileupload"),
    bodyParser         = require("body-parser"),
    expressValidator   = require("express-validator"),
    expressSanitizer   = require('express-sanitizer'),
    mongoose           = require("mongoose"),
    flash              = require('connect-flash'),
    expressSession     = require ("express-session"),
    passport           = require("passport"),
    LocalStrategy      = require("passport-local"),
    methodOverride     = require("method-override"),
    User               = require("./models/user"),
    Post               = require("./models/posts"),
    Like               = require ("./models/likes"),
    like               = require ("./public/js/like.js"),
    Fixture            = require ("./models/match"),
    Team               = require ("./models/team");

//*******************************************************

//requring routes
var commentRoutes        = require("./routes/comments");
var postRoutes           = require("./routes/posts");
var indexRoutes          = require("./routes/index");
var likeRoutes           = require ("./routes/likes");
var galleryRoutes        = require("./routes/gallery");
var friendRoutes         = require ("./routes/friends");
var fixtureRoutes        = require ("./routes/matches");
var teamRoutes           = require ("./routes/team");
var adminRoute           = require ("./routes/admin");
var  gameRoute           = require ("./routes/games");

//use the required modules

//mongoose.connect("mongodb://localhost/soc_2017");
var host="ds121345.mlab.com"
var port ="21345"
var dbuser="heroku_9c8j95xd"
var dbname ="heroku_9c8j95xd"
var dbpass="iiajf86dfd37bc8no8o5n0mq1k";
// mongodb://heroku_9c8j95xd:iiajf86dfd37bc8no8o5n0mq1k@ds121345.mlab.com:21345/heroku_9c8j95xd
// // mongodb://dbuser:dbpass@host1:port1,host2:port2/dbname
// // // mongoose.connnect("mongodb:heroku_12345678:6095KBADJEi@ds029017.mLab.com:29017/heroku_12345678");
// //mongoose.connect("mongodb://dbuser:dbpass@host:port/dbname");
// mongoose.connect("mongodb://localhost/soc_2017");


mongoose.connect(process.env.MONGOLAB_URI,function(err){
  if(err){
    console.log(err);
  }
 });
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());
app.use(expressSanitizer());
app.set("view engine","ejs");
//app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, '/public')));
app.use(fileUpload());
app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret :"once  upon a time",
   resave : false,
   saveUnitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.hasliked=[];
  res.locals.homeTeam=null;
  res.locals.awayTeam=null;

  next();
});

//*******************************************************
//add the index route when we see /
app.use("/",indexRoutes);
app.use("/posts",postRoutes);
app.use("/posts/:id/comments",commentRoutes);
app.use("/posts/:id/likes",likeRoutes);
app.use("/gallery",galleryRoutes);
app.use("/friends",friendRoutes);
app.use("/match",fixtureRoutes);
app.use("/teams",teamRoutes);
app.use("/soc_2017/com/admin",adminRoute);
app.use ("/gameCategory",gameRoute);

  app.listen(process.env.PORT || "4000", (req, res) => {
    console.log("Socializing app server has started on port: 4000");
  });
