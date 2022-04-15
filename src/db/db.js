const Sequelize = require('sequelize');

const db = new Sequelize('database', '', '', {
  dialect: 'sqlite',
  storage: process.env.DATABASE_FILE ?? 'database.db',
  logging: false,
});

module.exports = db;
