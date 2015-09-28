var mailer = require('../lib/mailer');
var emailTemplate = require('../lib/reminderTemplate');
var schedule = require('node-schedule');
var models = require('../models'),
  Event = models.Event;
  Car = models.Car;



module.exports = function(){

    // sends the email according to the template
    var emailSender = function(eventName, remindOnMileage, localName, carName){
        mailer.optionsEditor(emailTemplate("dear user!", eventName, remindOnMileage, carName), localName, 'Car Expense Tracker notification');
        mailer.transporter.sendMail(mailer.mailOptions, mailer.sendCallback);
    };

    // finds events belonging to a particular car and if most recent mileage reading is more than the event's one it invokes email notification
    var findEvents = function(carId, localName){
        console.log('carId is ' + carId + ', and name is ' + localName);
        Car.findOne({
            where: {
                id: carId
            }
        }).then(function(car){
            // console.log('car found is ', car);

            // looks for events in the car and if a match found, sends a reminder via email
            car.getEvents().then(function(events){
                // console.log('events are ', events);
                events.forEach(function(event){
                    if (event.remindOnMileage && !event.reminderSent && event.remindOnMileage <= car.mileage) {
                        emailSender(event.eventName, event.remindOnMileage, localName, car.customName);
                        console.log('sending a reminder for ', event.eventName);

                        // sets reminderSent property to 'true' to prevent future reminders
                        event.update({
                            reminderSent: true
                        }).then(function(){
                            console.log('event updated');
                        });
                    }
                    // } else if (!miles && event.remindOnMileage && !event.reminderSent && event.remindOnMileage <= car.mileage) {
                    //     emailSender(event.eventName, event.remindOnMileage, localName, car.customName);
                    //     console.log('Car mileage changed! sending a reminder for ', event.eventName);
                    // }
                });
            });
        });
    };


    return {
        findEvents: findEvents
    };
}();
