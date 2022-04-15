const User = require('./user');
const Post = require('./post');
const UserPost = require('./user_post');

User.belongsToMany(Post, {
  through: UserPost,
});
Post.belongsToMany(User, {
  through: UserPost,
});
User.hasMany(UserPost);
UserPost.belongsTo(User);
Post.hasMany(UserPost);
UserPost.belongsTo(Post);

module.exports = {
  User,
  Post,
  UserPost,
};
