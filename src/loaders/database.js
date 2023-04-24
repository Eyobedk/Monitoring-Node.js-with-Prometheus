const dbConfig = require("../../config/index.js");

const Sequelize = require("sequelize");

/**
 * Instantiate sequelize with name of database, username and password
 */
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Inject Database Instance to database models
db.tutorials = require("../models/tutorial.model.js")(sequelize, Sequelize);

module.exports = db;