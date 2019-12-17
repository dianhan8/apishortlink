'use strict';
module.exports = (sequelize, DataTypes) => {
  const limit = sequelize.define('limit', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    limitLink: DataTypes.INTEGER,
    limitRedirect: DataTypes.INTEGER
  }, {});
  limit.associate = function(models) {
    // associations can be defined here
  };
  return limit;
};