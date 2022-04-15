const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { User } = require('../db/models');

/**
 * Register a new user
 * req.body is expected to contain {username: required(string), password: required(string)}
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.create(req.body);

    const token = jwt.sign(
      { id: user.dataValues.id },
      process.env.SESSION_SECRET,
      { expiresIn: 86400 }
    );
    res.json({
      ...user.dataValues,
      token,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(401)
        .json({ error: 'User with provided username already exists' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(401).json({ error: 'Validation error' });
    }
    next(error);
  }
});

/**
 * Authenticate an existing user
 * req.body is expected to contain {username: required(string), password: required(string)}
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }

    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Wrong username and/or password' });
    }
    if (!User.correctPassword(user, password)) {
      return res.status(401).json({ error: 'Wrong username and/or password' });
    }
    const token = jwt.sign(
      { id: user.dataValues.id },
      process.env.SESSION_SECRET,
      { expiresIn: 86400 }
    );
    res.json({
      ...user.dataValues,
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
