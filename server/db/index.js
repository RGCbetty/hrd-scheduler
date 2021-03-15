const { Sequelize } = require('sequelize')
const config = require('../config')

const sequelize = new Sequelize(
  config.DBname,
  config.DBusername,
  config.DBpassword,
  {
    host: 'hrdsql',
    dialect: 'mssql',
    dialectOptions: {
      options: { encrypt: false },
    },
  },
  // {
  //   host: 'hrdsql',
  //   dialect: 'mssql',
  //   pool: {
  //     max: 5,
  //     min: 0,
  //     acquire: 30000,
  //     idle: 10000,
  //   },
  //   dialectOptions: {
  //     options: {
  //       encrypt: true,
  //     },
  //   },
  // },
)

module.exports = {
  sequelize,
}
