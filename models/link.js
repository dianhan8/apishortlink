'use strict';
module.exports = (sequelize, DataTypes) => {
  const link = sequelize.define('link', {
    title: DataTypes.STRING,
    url_in: DataTypes.STRING,
    url_out: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    ipaddress: DataTypes.STRING,
    redirect: DataTypes.BOOLEAN
  }, {});
  link.associate = function(models) {
    // associations can be defined here
  };
  return link;
};