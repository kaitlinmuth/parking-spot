var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  var file = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '../public', file));
});

router.post('/add', function(req, res, next){
  var spot = new Spot();
  spot.geometry = req.body.geometry;
  spot.save(function(err){
    if(err) throw new Error(err);
    response.send(spot.toJSON());
    next();
  });
});

//router.get('/spots', function(req, res, next){
//  return Spot.find({}).exec(function(err, spots){
//    if (err) throw new Error(err);
//    response.send(JSON.stringify(spots));
//    next();
//  });
//});

module.exports = router;
