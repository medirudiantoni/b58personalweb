'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  projects.init({
    name: DataTypes.STRING,
    start_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    description: DataTypes.STRING,
    nodeJS: DataTypes.BOOLEAN,
    nextJs: DataTypes.BOOLEAN,
    reactJs: DataTypes.BOOLEAN,
    typescript: DataTypes.BOOLEAN,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'projects',
  });
  return projects;
};