var express = require("express"),
    router  =express.Router({mergeParams:true}),
    Post    =  require ("../models/posts"),
    Like    = require("../models/likes"),
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

//like create --create a new like
router.post("/", function(req,res){
  //find the post that you want to add the commet to
  Post.findById(req.params.id).populate("likes").exec(function(err,foundPost){
    if(err){
      console.log(err)
      res.redirect("/posts")
    }else{
        //create a new like and  tag it to the post
        var id=req.user._id;
        var value=0;
        //check if there is an initail value for the likes
        if(foundPost.likes){
          value = foundPost.likes.size + 1;
        }else{
          value=1;
        }
        var newLike={tag:id,size:value};

        Like.create(newLike,function(err,newlyCreatedLike){
          if(err){
            req.flash("error",err)
          }else{
            newlyCreatedLike.save();

            //check if the person has not like this post already
            foundPost.likes.forEach(function(like){
              console.log("This is the size of the like"+like.size)
              if(!(like.tag === (id)) ){
                foundPost.likes.push(newlyCreatedLike);
                foundPost.save();
                res.send(foundPost.likes.size);
              }else {
                res.send("cannot like post")
              }
            });
          }
        });
    }
  })
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
