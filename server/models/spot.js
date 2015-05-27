/**
 * Created by kaitlinmuth on 5/26/15.
 */
var mongoose = require('mongoose');

var Spot = new mongoose.Schema({
    properties: {
        location: {
            longitude: mongoose.Schema.Types.ObjectId,
            latitude: mongoose.Schema.Types.ObjectId,
            altitude: mongoose.Schema.Types.ObjectId
        },
        created: Date,
        Notes: String,
        Timer: Date
    },
    geometry : {
        type: String,
        coordinates: [Number]
    }
});

module.exports = mongoose.model('spot', Spot);