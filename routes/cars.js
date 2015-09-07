var express = require('express');
var router = express.Router();
var models = require('../models'),
  User = models.User,
  Car = models.Car;

/* GET users listing. */
router
.get('/', function(req, res, next) {
  res.send('respond with a car');
})
.post('/', function(req, res, next){
  Car.create({
    UserId: req.user.id,
    customName: req.body.customName,
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    color: req.body.color
  });
  res.send(200);
});

module.exports = router;
