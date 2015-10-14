var express = require('express');
var router = express.Router();
var dataCollector = require('../lib/dataCollector');
var notificationScheduler = require('../lib/notificationScheduler');
var remindOnMilesScheduler = require('../lib/remindOnMilesScheduler');
var models = require('../models'),
  Event = models.Event,
  Car = models.Car;


/* GET users listing. */
router
.get('/', function(req, res, next){
    if(!req.user){
      var err = new Error("User not logged in.");
      console.log('error is ', err);
      return next(err);
    }
    var carsCount = 0;
    var eventsFound = [];
    Car.findAll({
        where: {
            UserId: req.user.id
        }
    }).then(function(cars){
        cars.forEach(function(car){
            Event.findAll({
                where: {
                    CarId: car.dataValues.id
                }
            }).then(function(events){
                eventsFound = eventsFound.concat(events);
                carsCount++;
                if (carsCount === cars.length) {
                    res.json(eventsFound);
                }
            });
        });
    });
})
.get('/:id', function(req, res, next) {
  if(!req.user){
    var err = new Error("User not logged in.");
    console.log('error is ', err);
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
.get('/:carid/:interval', function(req, res, next){
    Event.findAll({
        where: {
            CarId: +req.params.carid
        }
    }).then(function(events){
        res.json(events);
    }, next);
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
      var newEvent = event.dataValues;
      console.log('event created is ', newEvent);
      console.log('car name passed is ', req.body.carName);
      remindOnMilesScheduler.findEvents(newEvent.CarId, req.user.localName);
      if (newEvent.remindEvery && newEvent.nextReminder) {
          notificationScheduler.newSchedule(newEvent.nextReminder, newEvent.eventName, newEvent.remindEvery, newEvent.id, req.user.localName, req.body.carName);
      }
      res.status(200);
    //   dataCollector(req.user, res, req.body.statsPeriod);
  }, next);
  })
.put('/:id', function(req, res, next){
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
      notificationScheduler.deleteSchedule(req.params.id);
  Event.destroy({
    where: {
      id: +req.params.id
    }
  }).then(function(event){
    res.status(200);
    // dataCollector(req.user, res, req.body.statsPeriod);
  }, next);
});

module.exports = router;
