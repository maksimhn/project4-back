var express = require('express');
var router = express.Router();
var dataCollector = require('../lib/dataCollector');
var models = require('../models'),
  Expense = models.Expense,
  Car = models.Car;

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  res.send('respond with an expense');
})
.post('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  Expense.create({
    CarId: +req.body.carId,
    expenseName: req.body.expenseName,
    mileage: +req.body.mileage,
    amountSpent: +req.body.amountSpent,
    gas: req.body.gas
  }).then(function(err, expense){
    if (err) {
      next(err);
    }
    res.sendStatus(201);
  });
})
.put('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  Expense.findOne({
    where: {
      id: req.body.expenseId
    }
  }).then(function(expense){
    expense.update({
      expenseName: req.body.expenseName,
      mileage: +req.body.mileage,
      amountSpent: +req.body.amountSpent,
      gas: req.body.gas
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
  Expense.findOne({
    where: {
      id: req.body.expenseId
    }
  }).then(function(expense){
    expense.destroy().then(function(result){
      res.send(200);
    });
  });
});

module.exports = router;
