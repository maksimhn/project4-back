var nodemailer = require('nodemailer');


module.exports = function(){

    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'carexpensetracker@gmail.com',
            pass: 'wOg46C1j4oh2dxbb'
        }
    });

    var optionsEditor = function(text, email, subject){
        mailOptions.html = text;
        mailOptions.to = email;
        mailOptions.subject = subject;
    };

    var sendCallback = function(error, info){
      if(error){
          console.log(error);
      }else{
          console.log('Message sent: ' + info.response);
      }
  };

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Car Expense Tracker <carexpensetracker@gmail.com>', // sender address
        to: "", // list of receivers
        subject: 'Reminder from Car Expense Tracker', // Subject line
        text: "", // plaintext body
        html: "" // html body
    };



    return {
       transporter: transporter,
       mailOptions: mailOptions,
       optionsEditor: optionsEditor,
       sendCallback: sendCallback
   };
}();
