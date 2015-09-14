var express = require('express');
var router = express.Router();
var dataCollector = require('../lib/dataCollector');
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
  dataCollector(req.user, res);
})
.get('/:id', function(req, res, next){
  if (!req.user){
    var err = new Error("User not logged in");
    return next(err);
  }
  Car.findOne({
    where: {
      id: +req.params.id
    }
  }).then(function(car){
    res.json(car);
  })
})
.post('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  Car.create({
    UserId: +req.user.id,
    customName: req.body.customName,
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    color: req.body.color,
    mileage: +req.body.mileage
  }).then(function(car){
    dataCollector(req.user, res);
  }, next);
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
      dataCollector(req.user, res);
    }, next);
  });
})
.delete('/:id', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    console.log(err);
    return next(err);
  }
  console.log('car id is ', req.params.id);
  Car.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(car){
      dataCollector(req.user, res);
      console.log(car);
    }, next);
});

module.exports = router;
