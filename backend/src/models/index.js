"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "../config/database.js"))[env];
const db = {};

let sequelize;

if (env === "production") {
  // Verificamos múltiples nombres comunes por si acaso
  const prodUrl =
    process.env[config.use_env_variable] ||
    process.env.DB_URL ||
    process.env.JAWSDB_URL;

  if (!prodUrl) {
    throw new Error(
      `CRITICAL: No connection string found. Please set ${config.use_env_variable} in Render Environment Variables.`,
    );
  }

  sequelize = new Sequelize(prodUrl, config);
} else {
  // Desarrollo local
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

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

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
