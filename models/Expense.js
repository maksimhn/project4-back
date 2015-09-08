'use strict';

module.exports = function (sequelize, DataTypes) {
  var Expense = sequelize.define('Expense', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    expenseName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    amountSpent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gas: {
      type: DataTypes.BOOLEAN,
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

  return Expense;
};
