var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

router.get("/", function(req,res,next){
    res.sendFile(path.resolve(__dirname, '../public/views/login.html'));
});

router.get("/username", function(req,res,next){
    if(req.isAuthenticated()){
        console.log("Sending user data for", req.user);
        var user = {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            name: req.user.name
        };
        console.log("Sending data",user);
        res.send(user);
    } else res.send(false);
});

router.post('/',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

module.exports = router;
