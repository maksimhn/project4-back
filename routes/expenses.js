var express = require('express');
var router = express.Router();
var expensesCollector = require('../lib/expensesCollector');
var remindOnMilesScheduler = require('../lib/remindOnMilesScheduler');
var models = require('../models'),
  Expense = models.Expense,
  Car = models.Car;

/* GET users listing. */
router
.get('/:id/:interval', function(req, res, next) {
  if(!req.user){
    var err = new Error("User not logged in.");
    console.log('error is ', err);
    return next(err);
  }
  expensesCollector(req.user, res, +req.params.id, +req.params.interval);
})
.post('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  console.log('we are in expense creation route, statsPeriod is ', req.body.statsPeriod);
  Expense.create({
    CarId: +req.body.carId,
    expenseName: req.body.expenseName,
    mileage: +req.body.mileage,
    amountSpent: +req.body.amountSpent,
    gas: req.body.gas,
    date: req.body.date,
    dateInMilliseconds: req.body.dateInMilliseconds
  }).then(function(expense){
        Car.findOne({
            where: {
                id: expense.CarId
            }
        }).then(function(car){
            console.log('car inside expense creation is ', car);
            car.update({
                mileage: expense.mileage
            }).then(function(car){
                remindOnMilesScheduler.findEvents(car.id, req.user.localName);
            });
        });
        // dataCollector(req.user, res, req.body.statsPeriod);
    }, next);
  })
.put('/', function(req, res, next){
  if(!req.user){
    return next(err);
  }
  Expense.findOne({
    where: {
      id: +req.body.id
    }
  }).then(function(expense){
    expense.update({
      expenseName: req.body.expenseName,
      mileage: +req.body.mileage,
      amountSpent: +req.body.amountSpent,
      gas: req.body.gas,
      date: req.body.date,
      dateInMilliseconds: +req.body.dateInMilliseconds
  }).then(function(expense){
      Car.findOne({
          where: {
              id: expense.carId
          }
      }).then(function(car){
          console.log('Expense update, car found, about to update ', car);
          car.update({
              mileage: expense.mileage
          }).then(function(car){
              remindOnMilesScheduler.findEvents(car.id, req.user.localName);
          });
      });
    //   dataCollector(req.user, res, req.body.statsPeriod);
    }, next);
  });
})
.delete('/:id', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  Expense.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(expense){
    //   dataCollector(req.user, res, req.body.statsPeriod);
  }, next);
});

module.exports = router;
