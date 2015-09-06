'use strict';
// export a function for defining a sequelize model

module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('User', {
		id : {
			type : DataTypes.INTEGER,
			autoIncrement : true,
			primaryKey : true
		},
		localName : {
			type : DataTypes.STRING,
			allowNull : false,
			unique : true
		},
		localPass : {
			type : DataTypes.STRING,
			allowNull : false,
			unique : false
		}
	}, {
		timestamps : true
	});

	return User;
};

