var express = require('express');
var router = express.Router();
var models = require('../models'),
  User = models.User,
  Car = models.Car;

/* GET users listing. */
router
.get('/', function(req, res, next) {
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  res.send('respond with a car');
})
.post('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  Car.create({
    UserId: req.user.id,
    customName: req.body.customName,
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    color: req.body.color,
    mileage: req.body.mileage
  });
  res.send(200);
})
.put('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  Car.findOne({
    where: {
      id: req.body.carId
    }
  }).then(function(car){
    car.update({
      customName: req.body.customName,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color
    }).then(function(result){
      res.send(200);
    });
  });
})
.delete('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  Car.findOne({
    where: {
      id: req.body.carId
    }
  }).then(function(car){
    car.destroy().then(function(result){
      res.send(200);
    });
  });
});

module.exports = router;
