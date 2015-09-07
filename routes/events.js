var express = require('express');
var router = express.Router();
var models = require('../models'),
  Event = models.Event,
  Car = models.Car;

var createEvent = function(result, req, res){

};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with an event');
})
.post('/', function(req, res, next){
    Event.create({
    CarId: +req.body.carId,
    eventName: req.body.eventName,
    remindOnMileage: req.body.remindOnMileage,
    remindEvery: req.body.remindEvery,
    nextReminder: req.body.nextReminder,
    reminderSent: req.body.reminderSent,
    done: req.body.done
  }).then(function(err, event){
    if (err) {
      next(err);
    }
    res.sendStatus(201);
  });
});

module.exports = router;
