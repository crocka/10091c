const express = require('express');
const { Post, UserPost } = require('../db/models');

const router = express.Router();

const formatTags = function (response) {
  [...response].forEach((post) => {
    const tagsArr = post.tags.split(',');

    post.tags = tagsArr;
  });
};

/**
 * Create a new blog post
 * req.body is expected to contain {text: required(string), tags: optional(Array<string>)}
 */
router.post('/', async (req, res, next) => {
  try {
    // Validation
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { text, tags } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ error: 'Must provide text for the new post' });
    }

    // Create new post
    const values = {
      text,
    };
    if (tags) {
      values.tags = tags.join(',');
    }
    const post = await Post.create(values);
    await UserPost.create({
      userId: req.user.id,
      postId: post.id,
    });

    res.json({ post });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    // Validation
    if (!req.user) {
      return res.sendStatus(401);
    }

    if (req.query.authorIds.includes(req.user.id) === false) {
      return res
        .status(401)
        .json({ error: 'User is not authorized to view' });
    }

    // Get post
    const userId = req.user.id;

    const response = await Post.getPostsByUserId(userId, req.query);

    formatTags(response);

    res.json({ posts: response });
  } catch (error) {
    next(error);
  }
});

router.patch('/:postId', async (req, res, next) => {
  try {
    // Validation
    if (!req.user) {
      return res.sendStatus(401);
    }

    if (req.body.authorIds.includes(req.user.id) === false) {
      return res
        .status(401)
        .json({ error: 'User is not authorized to make changes' });
    }

    // Get post
    const { postId } = req.params;

    await Post.update(
      {
        tags: req.body.tags.join(),
        text: req.body.text,
        authorIds: req.body.authorIds },
      { where: { id: postId } }
    );

    const newPost = await Post.findOne({
      where: {
        id: postId,
      },
    });

    const tagsArr = newPost.tags.split(',');
    newPost.tags = tagsArr;

    res.json({ post: { ...newPost.dataValues, authorIds: req.body.authorIds } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
