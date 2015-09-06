'use strict';

module.exports = function (sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    // carId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: 'Cars',
    //   referencesKey: 'carId',
    //   onDelete: 'cascade'
    // },
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
      allowNull: false
    },
    nextReminder: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  },
  timestamps: true,
  classMethods: {
      // dostuff
  },
  instanceMethods: {
    // fine... boring comment.
  });

  return Event;
};
