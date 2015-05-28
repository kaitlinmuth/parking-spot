/**
 * Created by kaitlinmuth on 5/26/15.
 */
var mongoose = require('mongoose');

var Spot = new mongoose.Schema({
    longitude: Number,
    latitude: Number,
    created: Date,
    Notes: String,
    Timer: Date
});

module.exports = mongoose.model('spot', Spot);