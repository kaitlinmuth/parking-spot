var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local');

var index = require('./routes/index');
var spot = require('./routes/spot');
var User = require('./models/user');
//var login = require('./routes/login');
//var register = require('./routes/register');
var userRoute = require('./routes/users');

var app = express();

//connect to the database
var mongoURI = 'mongodb://localhost/parking_spots';
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err){
  console.log('mongodb connection error', err);
});

MongoDB.once('open', function(){
  console.log('mongodb connection open');
});

//// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 600000, secure: false}
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use('local', new localStrategy(
    {passReqToCallback : true, usernameField: 'username'},
    function(req, username, password, done){

}));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    if(err) done(err);
    done(null,user);
  });
});

passport.use('local', new localStrategy({
      passReqToCallback : true,
      usernameField: 'username'
    },
    function(req, username, password, done){
      User.findOne({ username: username }, function(err, user) {
        if (err) throw err;
        if (!user)
          return done(null, false, {message: 'Incorrect username and password.'});

        // test a matching password
        console.log("User found");
        user.comparePassword(password, function(err, isMatch) {
          if (err) throw err;
          if(isMatch)
            return done(null, user);
          else
            done(null, false, { message: 'Incorrect username and password.' });
        });
      });
    }));

app.use('/', index);
app.use('/spot', spot);
app.use('/users', userRoute);
//app.use('/register', register);
//app.use('/login', login);

var server = app.listen(3000, function(){
  var port = server.address().port;
  console.log("Listening on port: ", port);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
