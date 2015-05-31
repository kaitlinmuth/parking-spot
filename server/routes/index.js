var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */

router.get('/index', function(req, res, next){
  res.sendFile(path.join(__dirname, '..public/views/index.html'));
});

router.get('/', function(req, res, next) {
  var file = req.params[0] || 'views/index.html';
  console.log(req.isAuthenticated());
  res.sendFile(path.join(__dirname, '../public', file));
});

module.exports = router;
