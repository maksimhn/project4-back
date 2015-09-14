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

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

app.use(cors({
 credentials: true,
 origin: 'http://localhost:5000'
 // allowedHeaders: ['Cookie', 'Content-Type']
}));

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
		url : "mongodb://localhost/ga-passport-sessions"
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
