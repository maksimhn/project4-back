'use strict';

module.exports = function (sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    remindOnMileage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    remindEvery: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nextReminder: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
  timestamps: true,
  classMethods: {
  },
  instanceMethods: {
  }
});

  return Event;
};
