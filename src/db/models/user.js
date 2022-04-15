const Sequelize = require('sequelize');
const crypto = require('crypto');
const db = require('../db');

const User = db.define(
  'user',
  {
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      validate: {
        min: 6,
      },
      allowNull: false,
      get() {
        return () => this.getDataValue('password');
      },
    },
    salt: {
      type: Sequelize.STRING,
      get() {
        return () => this.getDataValue('salt');
      },
    },
  },
  {
    timestamps: true,
  }
);

User.correctPassword = function (user, password) {
  return User.encryptPassword(password, user.salt()) === user.password();
};

User.createSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};

User.encryptPassword = function (plainPassword, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainPassword)
    .update(salt)
    .digest('hex');
};

const setSaltAndPassword = (user) => {
  if (user.changed('password')) {
    user.salt = User.createSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate((users) => {
  users.forEach(setSaltAndPassword);
});

module.exports = User;
