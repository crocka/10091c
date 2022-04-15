const Sequelize = require('sequelize');
const db = require('../db');
const UserPost = require('./user_post');

const Post = db.define(
  'post',
  {
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    likes: {
      type: Sequelize.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    reads: {
      type: Sequelize.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    popularity: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: 0.0,
        max: 1.0,
      },
    },
    tags: {
      // note: comma separated string since sqlite does not support arrays
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Post.getPostsByUserId = async function (userId) {
  return Post.findAll({
    include: [
      {
        model: UserPost,
        as: 'user_posts',
        attributes: [],
        where: {
          userId,
        },
      },
    ],
  });
};

module.exports = Post;
