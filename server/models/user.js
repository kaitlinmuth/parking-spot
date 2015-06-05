/**
 * Created by kaitlinmuth on 5/29/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
var SpotSchema = require('../models/spot').model('Spot').schema;

var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    email: {type: String, required: true},
    name: {type: String, required: true},
    spots: [SpotSchema]
});


// before the password is saved, encrypt it using bcrypt
UserSchema.pre('save', function(next){
    var user = this;
    //only hash if the password is new or modified
    if (!user.isModified('password')) return next();

    //generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if (err) return next(err);

        // add salt to the password, then hash the combined string
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            //override the clear text password with the hashed one
            user.password = hash;
            next();
        })
    })
});

//comparePassword compares two passwords to see if they match
UserSchema.methods.comparePassword = function(candidatePassword, next){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if (err) return next(err);
        next(null, isMatch);
    })
};

module.exports = mongoose.model('User', UserSchema);