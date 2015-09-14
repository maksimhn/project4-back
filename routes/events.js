var express = require('express');
var router = express.Router();
var dataCollector = require('../lib/dataCollector');
var models = require('../models'),
  Event = models.Event,
  Car = models.Car;



/* GET users listing. */
router.get('/:id', function(req, res, next) {
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }
  Event.findOne({
    where: {
      id: +req.params.id
    }
  }).then(function(event){
    res.json(event);
  });
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
  }).then(function(event){
      dataCollector(req.user, res);
     }, next)
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
    }).then(function(event){
      dataCollector(req.user, res);
    }, next);
  });
})
.delete('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    return next(err);
  }

  Event.destroy({
    where: {
      id: req.body.eventId
    }
  }).then(function(event){
    dataCollector(req.user, res);
  }, next);
});

module.exports = router;
