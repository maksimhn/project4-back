var express = require('express');
var router = express.Router();
var passport = require('passport');
var async = require('async');
var bcrypt = require('bcrypt');
var models = require('../models'),
	User = models.User;
var dataCollector = require('../lib/dataCollector');


/* GET home page. */
router.get('/', function(req, res, next) {
	dataCollector(req.user, res);
	// console.log('dataCollector is ', dataCollector(req.user, res));
	// res.json(dataCollector(req.user));
	// res.render('index', {
	// 	title : (req.user && req.user.localName) || 'CarTracker'
	// });
});

/**AUTH ROUTES
 *	a login route using `passport.authenticate`
 *	a register route **not using passport**
 *
 */
router.route('/login').
	get(function(req, res, next) {
		res.sendStatus(405);
	}).
	post(passport.authenticate('local', {
		successRedirect : '/',
		failureRedirect : '/'
	}));

router.route('/signup').
	get(function(req, res, next) {
		res.sendStatus(405);
	}).
	post(function(req, res, next) {
		if(!req.body || !req.body.username || !req.body.password) {
			var err = new Error("No credentials.");
			return next(err);
		}

		async.waterfall([
			function(cb) {
				bcrypt.genSalt(16, cb);
			},
			function(salt, cb) {
				bcrypt.hash(req.body.password, salt, cb);
			},
			function(hash, cb) {
				User.create({
					localName : req.body.username,
					localPass : hash
				}).then(function(user) {
					cb(null, user);
				}, cb);
			}
		], function(err, result) {
			if(err) {
				// students will make error handler
				return next(err);
			}

			res.sendStatus(201);
		});
	});

module.exports = router;
