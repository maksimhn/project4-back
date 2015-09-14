var express = require('express');
var router = express.Router();
var dataCollector = require('../lib/dataCollector');
var models = require('../models'),
  Expense = models.Expense,
  Car = models.Car;

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  if(!req.user){
    var err = new Error("User not logged in.");
    console.log(err);
    return next(err);
  }
  Expense.findOne({
    where: {
      id: +req.params.id
    }
  }).then(function(expense){
    res.json(expense);
  });
})
.post('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    console.log(err);
    return next(err);
  }
  Expense.create({
    CarId: +req.body.carId,
    expenseName: req.body.expenseName,
    mileage: +req.body.mileage,
    amountSpent: +req.body.amountSpent,
    gas: req.body.gas
  }).then(function(expense){
    dataCollector(req.user, res);
  }, next);
})
.put('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    console.log(err);
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
      gas: req.body.gas
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
  Expense.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(expense){
      dataCollector(req.user, res);
  }, next);
});

module.exports = router;
