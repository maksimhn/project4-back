var async = require('async');
var models = require('../models'),
  Event = models.Event,
  Expense = models.Expense,
  User = models.User,
  Car = models.Car;


var dataCollector = function(user, res){
  var initialData = [];
  var cars = [];
  var events = [];
  var expenses = [];

  async.waterfall([function(cb){
    Car.findAll({
      where: {
        UserId: user.id
      }
    }).then(function(userCars){
      cars = userCars;
      for (var i = 0; i < cars.length; i++) {
        initialData.push({
          carId: cars[i].id,
          customName: cars[i].customName,
          make: cars[i].make,
          model: cars[i].model,
          year: cars[i].year,
          color: cars[i].color,
          mileage: cars[i].mileage,
        });
      }
      cb(null, cars);
    });
  }, function(cars, cb){
    var count = 0
    async.each(cars, function(car, done){
      car.getEvents().then(function(carEvents){
        initialData[count].events = carEvents;
        count++;
        done(null);
      });
    }, function(err){
      if (err) {
        cb(err);
      }
      cb(null, cars);
    });
  }, function(cars, cb){
    var count = 0;
    async.each(cars, function(car, done){
      car.getExpenses().then(function(carExpenses){
        initialData[count].expenses = carExpenses;
        count++;
        done(null);
      });
    }, function(err){
      if (err) {
        cb(err);
      } else {
        cb(null);
      }

    });
  }], function(err){
    if(err){
      return next(err);
    }
    res.json(initialData);
  });
};


module.exports = dataCollector;
