/**
 * Created by kaitlinmuth on 5/26/15.
 */
var express = require('express');
var app = express.Router();

var mongoose = require('mongoose');
var Spot = require('../models/spot.js');

app.get('/', function(req, res, next){
    Spot.find(function(err, data){
        response.json(data);
    })
});

app.post('/', function(req, res, next){
    var spot = new Spot();
    spot.created = new Date();
});

module.exports = app;