const express = require('express');

const posts = require('./posts');
const auth = require('./auth');

const router = express.Router();

router.use('/', auth);

router.use('/posts', posts);

module.exports = router;
