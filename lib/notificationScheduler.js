var mailer = require('../lib/mailer');
var emailTemplate = require('../lib/notificationTemplate')
var schedule = require('node-schedule');

var notificationScheduler = function (eventDate, eventName, remindEvery, localName){

    var date = new Date(eventDate);

    // var year = +eventDate.substr(6, 4);
    // var day = +eventDate.substr(3, 2);
    // var month = +eventDate.substr(0, 2) - 1;
    // if (eventDate.length === 18) {
    //     var hour = +eventDate.charAt(11);
    //     var minutes = +eventDate.substr(13, 2);
    //     if (eventDate.substr(16, 2) === "AM") {
    //
    //     } else if (eventDate.substr(16, 2) === "PM") {
    //         hour += 12;
    //     }
    // } else if (eventDate.length === 19) {
    //     var hour = +eventDate.substr(11, 2);
    //     var minutes = +eventDate.substr(14, 2);
    //     if (eventDate.substr(17, 2) === "AM") {
    //
    //     } else if (eventDate.substr(17, 2) === "PM") {
    //         hour += 12;
    //     }
    // }

    // console.log(eventDate, eventName, remindEvery, localName);
    // console.log('year is ', year);
    // console.log('month is ', month);
    // console.log('day is ', day);
    // console.log('hour is ', hour);
    // console.log('minutes is ', minutes);
    // console.log('ampm is ', ampm);

    // var date = new Date(year, month, day, hour, minutes, 0);
    console.log('our disassembled time is ', date);

    var j = schedule.scheduleJob(date, function(){
        mailer.optionsEditor(emailTemplate("dear user!", eventName, remindEvery), localName, 'Car Expense Tracker notification');
        mailer.transporter.sendMail(mailer.mailOptions, mailer.sendCallback);
        console.log('Sending it now, kinda');
    });
};

module.exports = notificationScheduler;
