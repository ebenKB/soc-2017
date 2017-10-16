var express     = require("express");
var path       = require("path");
var router      = express.Router();
var Post        = require("../models/posts");
var User        = require("../models/user");
var middleware  = require("../middleware");

//INDEX -- show all post
router.get("/", middleware.isLoggedIn,function(req,res){
  //get all posts from the database
  Post.find({}).populate("likes").exec(function(err, post){
    if(err){
      console.log();
    }else{
      // if(post.likes){
      //   likes =post.likes.count;
      // }
      //render the post page hereconsole.log("This is the comment part"+post.comments.text)
      res.render("./posts/showPost",{foundPost:post});
    }
  });
});

//CREATE  - add a new post DB
router.post("/", middleware.isLoggedIn, function(req,res){
   var title= req.body.title;
   var description=req.body.description;
   var imageName="";
   var image;
   var error=false;

   //check if the image is empty
   req.checkBody("req.files.image","Image is empty").isEmpty();
      error = req.validationErrors();

      //check if all the fields are empty
   if( title !=="" || description !== ""){
     console.log("this is error"+error)
    //  req.check("req.file.image","Image is empty").notEmpty();
    //     var error = req.validationErrors();

     //check if the image is not null
     if(req.files.image){
       imageName = req.files.image.name;
       image=req.files.image;
       //move the image to the specified folder
       image.mv("public/images/"+imageName,function(err){
        if(err){
          req.flash("error",err.message);
          //console.log("an error occurred while moving the file to the server")
        }else{
          console.log("image  moved")
        }
      });
     }

     //create a new post
     var newPost = {title:title, description:description,image:imageName, likeTag:0}

     //create an author for the  post
      var author = {id:req.user._id,username:req.user.username};
      newPost.author = author;

      //create the post and save to the db
      Post.create(newPost,function(err,newlyCreatedPost){
        if(err){
          req.flash("error","An error  occurred while creating the post");
        }else{
          req.flash("success","You added a new post");
          res.redirect("/posts")
        }
      });
   }
   else{
     req.flash("error","Post must have a title or a description!");
     res.redirect("/posts")
   }
});

//NEW - show the add new post form
router.get("/new",middleware.isLoggedIn,function(req,res){
  res.render("posts/new");
});

//EDIT POSTS -- show the form to edit the posts
router.get("/:id/edit",function(req,res){
  //find the post that you want to edit
  Post.findById(req.params.id, function(err, foundPost){
    res.render("posts/edit",{post:foundPost});
  });
  // res.send("edit here")
});

//UPDATE POST  --handle logic to update the found post
router.put("/:id",function(req,res){
  var like;
  if (req.body.hasOwnProperty("addLike")){
    like =1;
  }else if(req.body.hasOwnProperty("unLike")){
    like =-1;
  }
  if(req.body.hasOwnProperty("addLike") || req.body.hasOwnProperty("unLike")){
    //add a new like
    Post.findById(req.params.id,function(err,foundPost){      
        if(err){
          req.flash("error","an error occured")
        }else{
          if(req.body.hasOwnProperty("addLike")){
            foundPost.likeTag = foundPost.likeTag +1;
            foundPost.likeContainer.push(req.user.id);
            foundPost.update(foundPost,function(err,updatedPost){
              if(err){
                req.flash("error",err)
              }else{
                res.redirect("/posts")
              }
            });
          }else if(req.body.hasOwnProperty("unLike")){
              var newPost =foundPost;
              var likes=[];
              newPost.likeTag = newPost.likeTag  - 1;
              newPost.likeContainer.forEach(function(id){
                if(id !==req.user.id){
                  likes.push(id);
                }
                newPost.likeContainer = likes;
                console.log("we found a post in the unlike "+ newPost)

              });
              foundPost.update(newPost,function(err,updatedPost){
                if(err){
                  req.flash("error",err)
                }else{
                  res.redirect("/posts")
                }
              });
          }
        }
    });
  }
  else{
  Post.findByIdAndUpdate(req.params.id,req.body.post,function(err,updatedPost){
    if(err){
      console.log(err)
    }else{
      //redirect somewhere
      res.redirect("/posts");
    }
  })
}
});

//DESTROY POST --Delete a particular post from the database
router.delete("/:id",middleware.checkPostOwnership, function(req,res){
  Post.findByIdAndRemove(req.params.id,function(err){

    if(err){
      res.redirect("back");
    }else{
      console.log("deleted post")
      res.redirect("/posts");
    }
  });
});
module.exports = router;
