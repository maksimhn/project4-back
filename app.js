'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var uuid = require('uuid');
var MongoStore = require('connect-mongo')(session);
process.env.SESSION_SECRET || require('dotenv').load();
// require passport
// require passport config file
var passport = require('./lib/passport');

var routes = require('./routes/index');
var users = require('./routes/users');
var cars = require('./routes/cars');
var expenses = require('./routes/expenses');
var events = require('./routes/events');
var cors = require('cors');

var app = express();

// app.use(cors({
//  credentials: true,
//  origin: true
 // allowedMethods: 'POST, GET, PUT, DELETE, OPTIONS'
 // allowedHeaders: ['Cookie', 'Content-Type']
// }));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret : process.env.SESSION_SECRET,
	resave : false,
	saveUninitialized : false,
	store : new MongoStore({
		url : "mongodb://heroku_jcq62blk:9nt7lf54g86haen2ehinc90loa@ds041571.mongolab.com:41571/heroku_jcq62blk"
	}),
	cookie : {
		maxAge : 300000 // 5 minutes
	},
	genid : function(req) {
		return uuid.v4({
			rng : uuid.nodeRNG
		});
	}
}));
// mount return value of `passport.initialize` invocation on `app`
app.use(passport.initialize());
// mount return value of `passport.session` invocation on `app`
app.use(passport.session());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://maksimhn.github.io");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS'")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/cars', cars);
app.use('/expenses', expenses);
app.use('/events', events);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.status(err.status || 500);
    res.json(err.message);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json(err.message);
});


module.exports = app;
