'use strict';
module.exports = (sequelize, DataTypes) => {
  const count = sequelize.define('count', {
    link_id: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {});
  count.associate = function(models) {
    // associations can be defined here
  };
  return count;
};