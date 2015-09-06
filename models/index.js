'use strict';
// configure sequelize and import other models

require('dotenv').load();
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.SQL_DB,
	process.env.SQL_USER,
	process.env.SQL_PASS, {
		dialect : 'postgres',
		unixSocket : process.env.SQL_SOCK//,
//		hostname : process.env.SQL_HOST,
//		port : process.env.SQL_PORT
	});

var models = {
	'sequelize' : sequelize,
	User : sequelize.import('./User')
};

module.exports = models;

