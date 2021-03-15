const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  port: process.env.PORT,
  DBname: process.env.DB_NAME,
  DBusername: process.env.DB_USERNAME,
  DBpassword: process.env.DB_PASS,
}
