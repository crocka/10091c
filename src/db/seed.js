/* eslint-disable no-console */

const { User, Post, UserPost } = require('./models');
const db = require('./db');

const SEED_PW = '123456';

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  const thomas = await User.create({
    username: 'thomas',
    password: SEED_PW,
  });

  const santiago = await User.create({
    username: 'santiago',
    password: SEED_PW,
  });

  const ashanti = await User.create({
    username: 'ashanti',
    password: SEED_PW,
  });

  // post 1: multi-author
  const post1 = await Post.create({
    text: 'Excepteur occaecat minim reprehenderit cupidatat dolore voluptate velit labore pariatur culpa esse mollit. Veniam ipsum amet eu dolor reprehenderit quis tempor pariatur labore. Tempor excepteur velit dolor commodo aute. Proident aute cillum dolor sint laborum tempor cillum voluptate minim. Amet qui eiusmod duis est labore cupidatat excepteur occaecat nulla.',
    likes: 12,
    reads: 5,
    tags: 'food,recipes,baking',
    popularity: 0.19,
  });

  await UserPost.create({
    userId: santiago.id,
    postId: post1.id,
  });
  await UserPost.create({
    userId: thomas.id,
    postId: post1.id,
  });

  // post 2: single-author
  const post2 = await Post.create({
    text: 'Ea cillum incididunt consequat ullamco nisi aute labore cupidatat exercitation et sunt nostrud. Occaecat elit tempor ex anim non nulla sit culpa ipsum aliquip. In amet in Lorem ut enim. Consectetur ea officia reprehenderit pariatur magna eiusmod voluptate. Nostrud labore id adipisicing culpa sunt veniam qui deserunt magna sint mollit. Cillum irure pariatur occaecat amet reprehenderit nisi qui proident aliqua.',
    likes: 104,
    reads: 200,
    tags: 'travel,hotels',
    popularity: 0.7,
  });

  await UserPost.create({
    userId: santiago.id,
    postId: post2.id,
  });

  // post 3: multi-author
  const post3 = await Post.create({
    text: 'Voluptate consequat minim commodo nisi minim ut. Exercitation incididunt eiusmod qui duis enim sunt dolor sit nisi laboris qui enim mollit. Proident pariatur elit est elit consectetur. Velit anim eu culpa adipisicing esse consequat magna. Id do aliquip pariatur laboris consequat cupidatat voluptate incididunt sint ea.',
    likes: 10,
    reads: 32,
    tags: 'travel,airbnb,vacation',
    popularity: 0.7,
  });

  await UserPost.create({
    userId: santiago.id,
    postId: post3.id,
  });

  await UserPost.create({
    userId: ashanti.id,
    postId: post3.id,
  });

  // post 4: single-author
  const post4 = await Post.create({
    text: 'This is post 4',
    likes: 50,
    reads: 300,
    tags: 'vacation,spa',
    popularity: 0.4,
  });

  await UserPost.create({
    userId: ashanti.id,
    postId: post4.id,
  });

  // other users with no posts
  await Promise.all([
    User.create({
      username: 'julia',
      password: SEED_PW,
    }),
    User.create({
      username: 'cheng',
      password: SEED_PW,
    }),
  ]);

  console.log('seeded users and posts');
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;
