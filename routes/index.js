var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get("/profile", isLoggedIn, function(req, res){
  res.render("profile");
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
