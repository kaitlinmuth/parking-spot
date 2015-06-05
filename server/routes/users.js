var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Users = require('../models/user');
var Spots = require('../models/spot');

// GET /users
router.get('/', function(req,res,next){
    Users.find(function(err,users){
        if (err) return next(err);
        res.json(users);
    });
});

//POST /users/register
router.post('/register', function(req,res,next) {
    Users.create(req.body, function (err, post) {
        if (err)
            next(err);
        else
            res.json(post);
    });
});

// POST /users/login
router.post('/login', passport.authenticate('local'), function(req, res){
    if (req.isAuthenticated()){
        res.send(true);}
});

//GET users/username
router.get('/username', function(req,res, next){
    if(req.isAuthenticated()){
        console.log("Sending user data for", req.user);
        var user = {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            name: req.user.name,
            spots: req.user.spots
        };
        console.log("Sending data",user);
        res.send(user);
    } else res.send(false);
});

// PUT /users/username
router.put('/:id', function(req, res, next){
    Users.findByIdAndUpdate(req.params.id, req.body, function(err, post){
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;