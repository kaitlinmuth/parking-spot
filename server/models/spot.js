/**
 * Created by kaitlinmuth on 5/26/15.
 */
var mongoose = require('mongoose');

var Spot = new mongoose.Schema({
    longitude: {type: Number, required: true},
    latitude: {type: Number, required: true},
    created: Date,
    Notes: String,
    Timer: Date
});

module.exports = mongoose.model('Spot', Spot);