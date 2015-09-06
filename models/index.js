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
	User : sequelize.import('./User'),
  Car :  sequelize.import('./Car'),
  Expense : sequelize.import('./Expense'),
  Event : sequelize.import('./Event')
};

models.Car.belongsTo(models.User, {foreignkey: 'userId'});
models.User.hasMany(models.Car, {foreignkey: 'userId'});

models.Event.belongsTo(models.Car);
models.Car.hasMany(models.Event);

models.Expense.belongsTo(models.Car);
models.Car.hasMany(models.Expense);

module.exports = models;

