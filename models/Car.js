'use strict';

module.exports = function (sequelize, DataTypes) {
  var Car = sequelize.define('Car', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    customName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
  timestamps: true,
  classMethods: {
      // dostuff
  },
  instanceMethods: {
    // fine... boring comment.
  }
});

  return Car;
};
