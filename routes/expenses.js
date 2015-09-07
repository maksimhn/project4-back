var express = require('express');
var router = express.Router();
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
});

module.exports = router;
