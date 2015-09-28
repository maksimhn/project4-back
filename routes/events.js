var express = require('express');
var router = express.Router();
var dataCollector = require('../lib/dataCollector');
var notificationScheduler = require('../lib/notificationScheduler');
var remindOnMilesScheduler = require('../lib/remindOnMilesScheduler');
var models = require('../models'),
  Event = models.Event,
  Car = models.Car;


/* GET users listing. */
router.get('/:id', function(req, res, next) {
  if(!req.user){
    var err = new Error("User not logged in.");
    console.log(err);
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
    console.log(err);
    return next(err);
  }

  Event.create({
    CarId: +req.body.carId,
    eventName: req.body.eventName,
    remindOnMileage: req.body.remindOnMileage || null,
    remindEvery: req.body.remindEvery || null,
    nextReminder: req.body.nextReminder || null,
    reminderSent: req.body.reminderSent || false,
    done: req.body.done
  }).then(function(event){
      console.log('event created is ', event.dataValues);
      remindOnMilesScheduler.findEvents(event.dataValues.CarId, req.user.localName);
      if (event.dataValues.remindEvery && event.dataValues.eventDate) {
          notificationScheduler.newSchedule(event.dataValues.nextReminder, event.dataValues.eventName, event.dataValues.remindEvery, event.dataValues.id, req.user.localName, req.body.carName);
      }
      dataCollector(req.user, res, req.body.statsPeriod);
  }, next);
  })
.put('/', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    console.log(err);
    return next(err);
  }
  Event.findOne({
    where: {
      id: req.body.id
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
        // console.log('updated event is ', event.dataValues);
        console.log('req.user is ', req.user);
        remindOnMilesScheduler.findEvents(event.dataValues.CarId, req.user.localName);
        notificationScheduler.newSchedule(event.dataValues.nextReminder, event.dataValues.eventName, event.dataValues.remindEvery, event.dataValues.id, req.user.localName, req.body.carName);
      if (event.dataValues.remindEvery == "0") {
          notificationScheduler.deleteSchedule(event.dataValues.id);
      }
      dataCollector(req.user, res, req.body.statsPeriod);
    }, next);
  });
})
.delete('/:id', function(req, res, next){
  if(!req.user){
    var err = new Error("User not logged in.");
    console.log(err);
    return next(err);
  }
      notificationScheduler.deleteSchedule(req.params.id);
  Event.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(event){

    dataCollector(req.user, res, req.body.statsPeriod);
  }, next);
});

module.exports = router;
