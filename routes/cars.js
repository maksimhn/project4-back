var express = require('express');
var router = express.Router();
var dataCollector = require('../lib/dataCollector');
var remindOnMilesScheduler = require('../lib/remindOnMilesScheduler');
var models = require('../models'),
  User = models.User,
  Car = models.Car;

/* GET users listing. */
router
.get('/', function(req, res, next){
    if(!req.user){
      var err = new Error("User not logged in.");
      return next(err);
    }
    Car.findAll({
        where: {
            userId: req.user.id
        }
    }).then(function(cars){
        res.json(cars);
    }, next);
})

.get('/:id', function(req, res, next) {
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  Car.findOne({
      where: {
          id: +req.params.id
      }
  }).then(function(car){
      res.json(car);
  }, next);
    // dataCollector(req.user, res, req.params.period);
})

.post('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    console.log(err);
    return next(err);
  }
  Car.create({
    userId: +req.user.id,
    customName: req.body.customName,
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    color: req.body.color,
    mileage: +req.body.mileage
  }).then(function(car){
      res.status(200);
    // dataCollector(req.user, res, req.body.statsPeriod);
  }, next);
})
.put('/:id', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    console.log(err);
    return next(err);
  }
  Car.findOne({
    where: {
      id: +req.params.id
    }
  }).then(function(car){
    car.update({
      customName: req.body.customName,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      mileage: req.body.mileage
  }).then(function(car){
      remindOnMilesScheduler.findEvents(car.id, req.user.localName);
      res.status(200);
    //   dataCollector(req.user, res, req.body.statsPeriod);
    }, next);
  });
})
.delete('/:id', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    console.log(err);
    return next(err);
  }
  Car.destroy({
    where: {
      id: +req.params.id
    }
  }).then(function(car){
      res.status(200);
    //   dataCollector(req.user, res, req.body.statsPeriod);
    }, next);
});

module.exports = router;
