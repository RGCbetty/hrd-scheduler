const { Sequelize, DataTypes, Model } = require('sequelize')
const { sequelize } = require('../index')

class User extends Model {}

User.init({
  {
    

  },{
    sequelize,
    modelName: "Employees"
  }
})