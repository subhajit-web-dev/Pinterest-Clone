var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const upload = require("./multer"); 

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get("/profile", isLoggedIn, async function(req, res){
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  res.render("profile", {user});
});

router.post("/upload", upload.single("file"), async function(req, res){
  if(!req.file){
    return res.status(404).send("No files were given");
  }
 const user = await userModel.findOne({username: req.session.passport.user})
  const post = await postModel.create({
    images: req.file.filename,
    caption: req.body.caption,
    user: user._id
  });

  user.posts.push(post._id);
  await user.save();
  res.send("done");
});
 
router.get("/feed", function(req, res){
  res.render("feed");
});

router.get("/login", function(req, res){
  res.render("login", {error: req.flash("error")});
});

router.post("/register", function(req, res){
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname
  });

  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile");
    })
  })
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), function(req, res){});

router.get("/logout", function(req, res){
  req.logout(function(err){
    if(err){ return next(err); }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

module.exports = router;
