const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});

module.exports = {
  HOST: process.env.DATABASE_HOST,
  USER: process.env.DB_USER_NAME,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DATABASE_NAME,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  port: process.env.PORT,
  metrics_port: process.env.METRICS_PORT
};
