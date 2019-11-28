'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phonenumber: DataTypes.INTEGER,
    payment_number: DataTypes.INTEGER,
    disable: DataTypes.BOOLEAN,
    verify_email: DataTypes.BOOLEAN,
    verify_phonenumber: DataTypes.BOOLEAN,
    premium: DataTypes.BOOLEAN
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};