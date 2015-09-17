'use strict';
// configure sequelize and import other models

require('dotenv').load();
var Sequelize = require('sequelize');
// var sequelize = new Sequelize("d45eg72u0osanv",
// 	"ohjdmwgvurtwws",
// 	"7cmDxuqyYlIFK8M4JboKu0W5j4", {
// 		dialect : 'postgres',
// 		unixSocket : "/var/run/postgresl/.s.PGSQL.5432",
// 		hostname : "ec2-54-163-238-96.compute-1.amazonaws.com",
// 		port : 5432
// 	});


if (process.env.DATABASE_URL) {
 var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
 // the application is executed on Heroku ... use the postgres database
 var sequelize = new Sequelize(match[5], match[1], match[2], {
   dialect:  'postgres',
   protocol: 'postgres',
   port:     match[4],
   host:     match[3]
   // dialectOptions: {
   //      ssl: true
   //  }
 });

} else {
 var sequelize = new Sequelize(process.env.SQL_DB,
   process.env.SQL_USER,
   process.env.SQL_PASS,

   {
     host: process.env.SQL_HOST,
     port: process.env.SQL_PORT,
     dialect: 'postgres',
     protocol: 'postgres'
    //  dialectOptions: {
    //     ssl: true
    // }
   }
 );
};





var models = {
	'sequelize' : sequelize,
	User : sequelize.import('./User'),
  Car :  sequelize.import('./Car'),
  Expense : sequelize.import('./Expense'),
  Event : sequelize.import('./Event')
};

models.Car.belongsTo(models.User, {foreignkey: 'userId'});
models.User.hasMany(models.Car, {foreignkey: 'userId', onDelete: 'cascade', hooks: true});

models.Event.belongsTo(models.Car, {foreignkey: 'carId'});
models.Car.hasMany(models.Event, {foreignkey: 'carId', onDelete: 'cascade', hooks: true});

models.Expense.belongsTo(models.Car, {foreignkey: 'carId'});
models.Car.hasMany(models.Expense, {foreignkey: 'carId', onDelete: 'cascade', hooks: true});

module.exports = models;
