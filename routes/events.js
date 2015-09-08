var express = require('express');
var router = express.Router();
var models = require('../models'),
  Event = models.Event,
  Car = models.Car;

var createEvent = function(result, req, res){

};

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  res.send('respond with an event');
})
.post('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
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
})
.put('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  Event.findOne({
    where: {
      id: req.body.eventId
    }
  }).then(function(event){
    event.update({
      eventName: req.body.eventName,
      remindOnMileage: req.body.remindOnMileage,
      remindEvery: req.body.remindEvery,
      nextReminder: req.body.nextReminder,
      reminderSent: req.body.reminderSent,
      done: req.body.done
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
  Event.findOne({
    where: {
      id: req.body.eventId
    }
  }).then(function(event){
    event.destroy().then(function(result){
      res.send(200);
    });
  });
});

module.exports = router;
