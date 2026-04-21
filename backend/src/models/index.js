"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// Pointing this to my custom JS config instead of the auto-generated JSON file
const config = require(path.join(__dirname, "../config/database.js"))[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  // If I'm deploying to production, I'll likely use a single URL string
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Local development setup reading from my .env variables
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

// Reading all the model files in this directory and hooking them up
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

// Setting up associations if I defined any in the models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
