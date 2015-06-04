/**
 * Created by kaitlinmuth on 5/26/15.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Users = require('../models/user');
var Spots = require('../models/spot');

//POST /users/spots/add/
router.post('/add', function(req,res,next) {
    var spot = new Spots({
        latitude: req.body.spot.latitude,
        longitude: req.body.spot.longitude,
        created: req.body.spot.created
    });
    Users.findById(req.user._id).exec(function (err, user) {
        if (err) {
            next(err);
        }
        try {
            user.spots.push(spot);
            user.save(function (err) {
                if (err) return next(err);
                else res.json(spot);
            });
        }catch(exception){
            next(err);
        }
    });
});

//PUT /users/spots/update
router.put('/update', function(req, res, next) {
    console.log("Got request to update spot", req.body);
    Users.findById(req.user._id).exec(function (err, user) {
        var oldSpot = user.spots.pop();
        var newSpot = new Spots({
            latitude: req.body.spot.latitude,
            longitude: req.body.spot.longitude,
            created: req.body.spot.created
        });
        console.log("Updated spot is", newSpot);
        if (err) {
            console.log("Find user failed:", err);
            next(err);
        }
        try {
            user.spots.push(newSpot);
            user.save(function (err) {
                if (err) return next(err);
                else res.json(newSpot);
            });
        } catch (exception) {
            console.log("Save spot failed: ", exception);
            next(err);
        }
    });
});

module.exports = router;