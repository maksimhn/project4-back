var express = require('express');
var router = express.Router();
var dataCollector = require('../lib/dataCollector');
// var mailer = require('../lib/mailer');
// var emailTemplate = require('../lib/notificationTemplate')
// var schedule = require('node-schedule');
var notificationScheduler = require('../lib/notificationScheduler');
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

  Car.findOne({
      where: {
          id: +req.body.carId
      }
  }).then(function(car){
      console.log(car);
      notificationScheduler(req.body.nextReminder, req.body.eventName, req.body.remindEvery, req.user.localName)
  });
  // mailer.optionsEditor(emailTemplate("dear user!", req.body.eventName, req.body.remindEvery), req.user.localName, 'Car Expense Tracker notification');
  // mailer.transporter.sendMail(mailer.mailOptions, mailer.sendCallback);

  Event.create({
    CarId: +req.body.carId,
    eventName: req.body.eventName,
    remindOnMileage: req.body.remindOnMileage || null,
    remindEvery: req.body.remindEvery || null,
    nextReminder: req.body.nextReminder || null,
    reminderSent: req.body.reminderSent || false,
    done: req.body.done
  }).then(function(event){
      dataCollector(req.user, res);
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
  Event.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(event){
    dataCollector(req.user, res);
  }, next);
});

module.exports = router;
