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

    // Get postId
    const { postId } = req.params;

    //Get user_post
    const authorsObj = await UserPost.findAll(

      {
        where: { postId: postId }
      });

    let authors = authorsObj.map(author => author.dataValues.userId).sort((a, b) => a - b);

    // Validate if user is author
    if (authors.includes(req.user.id) === false) {
      return res
        .status(401)
        .json({ error: 'User is not authorized to make changes' });
    }

    // If authorIds is present, update authors
    if (req.query.authorIds) {

      //find new authors
      req.query.authorIds.forEach(author => {

        // if new list of authors does not contain the old author, create a new UserPost
        if (authors.includes(author) === false) {

          UserPost.create({
            userId: author,
            postId: postId,
          });

        }

      });

      authors.forEach(author => {

        // if old list of authors contains authors no longer in the new list, destroy it
        if (req.query.authorIds.includes(author) === false) {

          UserPost.destroy({
            where: {userId: author, postId: postId}
          })
        }

      });

    }

    // Update post
    await Post.update(
      {
        tags: req.body.tags ? req.body.tags.join() : Post.tags,
        text: req.body.text ? req.body.text : Post.text,
        // authorIds: req.body.authorIds ? req.body.authorIds : Post.authorIds 
      },
      { where: { id: postId } }
    );

    const newPost = await Post.findOne({
      where: {
        id: postId,
      },
    });

    const tagsArr = newPost.tags.split(',');
    newPost.tags = tagsArr;

    res.json({ post: { ...newPost.dataValues, authorIds: req.body.authorIds ? req.body.authorIds : authors } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
