'use strict';
/**REQUIRES
 *	passport
 *	passport-local
 *	bcrypt
 *	user model
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var models = require('../models'),
	User = models.User;


/**DEFINITIONS
 *	passport methods:
 *		passport.serializeUser
 *		passport.deserializeUser
 *	objects:
 *		local strategy instance
 *
 */
passport.serializeUser(function(user, done) {
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	User.findOne({
		where : {
			'id' : id
		}
	}).then(function(user) {
		done(null, user);
	}).catch(function(err) {
		done(err);
	});
});

var localStrat = new LocalStrategy(function(username, password, done) {
	User.findOne({
		where : {
			localName : username
		}
	}).then(function(user) {
		if(!user) {
			return done(null, false);
		}

		bcrypt.compare(password, user.localPass, function(err, match) {
			if(err) {
				return done(err);
			}

			done(null, match ? user : false);
		});
	}).catch(function(err) {
		done(err);
	});
});

/**INVOCATIONS
 *	passport.use:
 *		local strategy instance
 *
 */
passport.use(localStrat);

module.exports = passport;
