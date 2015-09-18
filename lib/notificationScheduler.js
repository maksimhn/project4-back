var mailer = require('../lib/mailer');
var emailTemplate = require('../lib/notificationTemplate')
var schedule = require('node-schedule');

var notificationScheduler = function (eventDate, eventName, remindEvery, localName, carName){

    var emailSender = function(){
        mailer.optionsEditor(emailTemplate("dear user!", eventName, remindEvery, carName), localName, 'Car Expense Tracker notification');
        mailer.transporter.sendMail(mailer.mailOptions, mailer.sendCallback);
        console.log('Sending it now, kinda');
    };

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
            var j = schedule.scheduleJob(date, emailSender);
            console.log('scheduling for once');
            break;
        // SENDING NOTIFICATION WEEKLY
        case "week":
            rule += "0" + " " + minutes + " " + hour + " " + day + " " + "* " + weekday;
            var j = schedule.scheduleJob(rule, emailSender);
            console.log('scheduling for week');
            break;
        // SENDING NOTIFICATION MONTHLY
        case "month":
            rule += "0" + " " + minutes + " " + hour + " " + day + " * *";
            var j = schedule.scheduleJob(rule, emailSender);
            console.log('scheduling for month');
            break;
        // SENDING NOTIFICATION YEARLY
        case "year":
            rule += "0" + " " + minutes + " " + hour + " " + day + " " + month + " *";
            var j = schedule.scheduleJob(rule, emailSender);
            console.log('scheduling for year');
            break;
        default:
            console.log('reached default');
    };

};

module.exports = notificationScheduler;
