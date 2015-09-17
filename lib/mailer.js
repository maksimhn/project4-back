var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'carexpensetracker@gmail.com',
        pass: 'wOg46C1j4oh2dxbb'
    }
});


// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Car Expense Tracker <carexpensetracker@gmail.com>', // sender address
    to: "", // list of receivers
    subject: 'Reminder from Car Expense Tracker', // Subject line
    text: "", // plaintext body
    html: "" // html body
};


// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});

module.exports = transporter;
