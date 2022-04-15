const db = require('../db');

const UserPost = db.define('user_post', {}, { timestamps: false });

module.exports = UserPost;
