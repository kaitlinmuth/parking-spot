/**
 * Created by kaitlinmuth on 5/26/15.
 */
var express = require('express');
var app = express.Router();

var mongoose = require('mongoose');
var Spot = require('../models/spot');

// GET spot list
app.get('/', function(req, res, next){
    Spot.find(function(err, data){
        if (err) return next(err);
        res.json(data);
    })
});

// GET spot by user
app.get('/user', function(req, res, next){
    var user = req.body;
    Spot.find({_id: user}, 'longitude latitude created Notes Timer', function(err, data){
        if (err) return next(err);
        res.json(data);
    })
})

/* PUT /spot/:id */
app.put('/:id', function(req, res, next) {
    Spot.findByIdAndUpdate(req.params.id, req.body, function (err, spot) {
        if (err) return next(err);
        res.json(spot);
    });
});

//POST /spot
app.post('/', function(req, res, next){
    Spot.create(req.body, function(err, spot){
        if (err) return next(err);
        res.json(spot);
    });
});

/* GET /spot/:id */
app.get('/:id', function(req, res, next) {
    Spot.findById(req.params.id, req.body, function (err, spot) {
        if (err) return next(err);
        res.json(spot);
    });
});

/* PUT /spot/:id */
app.put('/:id', function(req, res, next) {
    Spot.findByIdAndUpdate(req.params.id, req.body, function (err, spot) {
        if (err) return next(err);
        res.json(spot);
    });
});

/* DELETE /spot/:id */
app.delete('/:id', function(req, res, next) {
    Spot.findByIdAndRemove(req.params.id, req.body, function (err, assignment) {
        if (err) return next(err);
        res.json(assignment);
    });
});

module.exports = app;