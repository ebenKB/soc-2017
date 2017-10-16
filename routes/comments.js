var express = require("express"),
    router  =express.Router({mergeParams:true}),
    Post    =  require ("../models/posts"),
    Comment  = require ("../models/comments"),
    middleware  = require("../middleware");
    //middleware = require ("../middleware");

router.get("/",function(req,res){
  Post.findById(req.params.id). populate("comments").exec(function(err, foundPost){

    if(err){
      console.log(err);
    }else{
      res.render("comments/new",{post:foundPost});
    }
  })
})

// new comment --show the form here
router.get("/new",function(req,res){
  Post.findById(req.params.id,function(err,post){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new",{post:post});
    }
  })

});

//Comment create --create a new comment
router.post("/",function(req,res){
  //check if the text fields are valid
  var text ="me";
  req.check('comment',"Error ").notEmpty();

  //get the errors
  var errors = req.validationErrors();
  if(errors){
    console.log(errors);
  }else{
    //find the post that you want to add the commet to
    Post.findById(req.params.id,function(err,foundPost){
      if(err){
        console.log(err)
        res.redirect("/posts")
      }else{
        req.body.sanitized = req.sanitize(req.body.comment);
        //create a new comment
        var newComment = {text:req.body.comment};
        Comment.create(newComment,function(err,comment){
          if(err){
            console.log(err)
          }else{
            //add the username and id to comment that you have created
            comment.author.id=req.user._id;
            comment.author.username = req.user.username;

            //save the comment
            comment.save();
            foundPost.comments.push(comment);
            foundPost.save();

            //redirect the user to the comments page
            res.redirect('/posts/' + foundPost._id+"/comments");
        }
      });
      }
    })
  }
});

//COMMENTS EDIT -- shows the edit form for one comment
router.get("/:comment_id/edit",function(req,res){
    Comment.findById(req.body.id, (err,foundComment ) => {
      if(err){
        res.redirect("back");
      }else {
        res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
      }
    });
});

//UPDATE COMMENT - updates a particular comment
router.get("/comments/:id/edit", function(req,res){
Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
  if(err){
    res.redirect("back");
  }else{
    //redirect somewhere
    res.redirect("/posts/"+req.params.id);
  }
  });
});

//Delete comment


//make the router available to app to use
module.exports = router;
