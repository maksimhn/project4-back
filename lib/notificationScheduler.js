var mailer = require('../lib/mailer');
var emailTemplate = require('../lib/notificationTemplate');
var schedule = require('node-schedule');

module.exports = function(){

    // sends the email according to the template
    var emailSender = function(eventName, remindEvery, localName, carName){
        mailer.optionsEditor(emailTemplate("dear user!", eventName, remindEvery, carName), localName, 'Car Expense Tracker notification');
        mailer.transporter.sendMail(mailer.mailOptions, mailer.sendCallback);
    };

    // deletes an event sheduled using event id
    var deleteSchedule = function(eventId) {
        var jobId = eventId.toString();
        if (schedule.scheduledJobs[jobId]) {
            schedule.scheduledJobs[jobId].cancel();
        }
        console.log('and now jobs scheduled are ', schedule.scheduledJobs);
    };

    // creates a new scheduled job based on the arguments passed
    var newSchedule = function (eventDate, eventName, remindEvery, eventId, localName, carName){

        if (remindEvery != "0") {

            var date = new Date(eventDate);
            var rule = "";
            var weekday = date.getDay();
            var year = +eventDate.substr(6, 4);
            var day = +eventDate.substr(3, 2);
            var month = +eventDate.substr(0, 2) - 1;
            if (eventDate.length === 18) {
                var hour = +eventDate.charAt(11);
                var minutes = +eventDate.substr(13, 2);
                if (eventDate.substr(16, 2) === "PM") {
                    hour += 12;
                }
            } else if (eventDate.length === 19) {
                var hour = +eventDate.substr(11, 2);
                var minutes = +eventDate.substr(14, 2);
                if (eventDate.substr(17, 2) === "PM") {
                    hour += 12;
                }
            }

                switch (remindEvery) {
                    // SENDING NOTIFICATION ONCE
                    case "once":
                        schedule.scheduleJob(eventId.toString(), date, function(){
                            emailSender(eventName, remindEvery, localName, carName);
                        });
                        console.log('scheduling for once');
                        break;
                    // SENDING NOTIFICATION WEEKLY
                    case "week":
                        rule += "0" + " " + minutes + " " + hour + " " + day + " " + "* " + weekday;
                        schedule.scheduleJob(eventId.toString(), rule, function(){
                            emailSender(eventName, remindEvery, localName, carName);
                        });
                        console.log('scheduling for week');
                        break;
                    // SENDING NOTIFICATION MONTHLY
                    case "month":
                        rule += "0" + " " + minutes + " " + hour + " " + day + " * *";
                        schedule.scheduleJob(eventId.toString(), rule, function(){
                            emailSender(eventName, remindEvery, localName, carName);
                        });
                        console.log('scheduling for month');
                        break;
                    // SENDING NOTIFICATION YEARLY
                    case "year":
                        rule += "0" + " " + minutes + " " + hour + " " + day + " " + month + " *";
                        schedule.scheduleJob(eventId.toString(), rule, function(){
                            emailSender(eventName, remindEvery, localName, carName);
                        });
                        break;
                    default:
                        console.log('reached default');
                };

            }

        console.log('jobs scheduled are ', schedule.scheduledJobs);
    };

    return {
        deleteSchedule: deleteSchedule,
        newSchedule: newSchedule
    };
}();
