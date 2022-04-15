# Hatchways Work Simulation

## General Instructions

For this project, you are provided a starting code for a back end JSON API and are to build on this starting code by adding new features. The starting code is for the application described in the section below, and you can find your assigned work on the Issues tab of this repository. Please open a **single pull request** with all of the changes needed to implement the features described in the issue, then return to the Hatchways dashboard to mark your assessment as completed.

**Note: Add the following after we have tests, not for our initial test run:**

Note that this repository contains some tests that will run on GitHub actions once you create a pull requests. These simple tests will ensure that your app is running as expected and that you have completed the basics of the assigned tasks. You will not be able to mark your assessment as completed until these tests pass. There are additional, more thorough tests that will run once you mark your assessment as completed. After submitting, you will be able to see the high level results but not the specific details of these tests.

We will use [this rubric](https://drive.google.com/file/d/103oOiqjxd_N1JckefKqPJjndqX1qvqdL/view?usp=sharing) to evaluate your submission. Please note that if your submission does not attempt to complete all of the requirements, or does not pass our plagiarism screening, we will be unable to provide feedback on it. Please contact hello@hatchways.io if you have any questions or concerns.

---

## Introduction to this Application

You will be modifying an existing server that provides an API for a blogging website. The database for the API has a collection of blog `Posts`, which include information about each blog post such as the text and author of the post, how many times the post has been “liked”, etc. Additionally, the database contains `Users`. Each blog post can have multiple authors, which correspond to users in the database (this association is stored in the database as `UserPost`). A new blog post must have at least one author that is a user already registered in the database.

Currently, the starting code has the following API routes already implemented:

- POST `/api/register` - Register a new user
- POST `/api/login` - Login for an existing user
- POST `/api/posts` - Create a new post

Only a logged in `User` can use this blogging website API, with the exception of the login and register routes.

---

## System Requirements

The current recommended [Node.js version](https://nodejs.org/en/) is 16

---

## Server

Create a `.env` file in the root directory, and copy the contents from [.env.sample](.env.sample)

### Setup

```
npm install
```

### Lint

```
npm run lint
```

### Development

```
npm run dev
```

### Run tests

```
npm test
```

---

## Database

### Setup

**Note: No database setup should be required to get started with running the project.**

This project uses SQLite, which stores your tables inside a file. It uses [Sequelize (v6)](https://sequelize.org/) as an ORM layer.

### Seed Data

We've included sample data that the application has been configured to use. If you want to re-seed the database, you can run `npm run seed`. [seed.js](./src/db/seed.js) can be referenced to see what the sample data is. Viewing the database file itself is not required to complete your tasks, but if you would like to, an application like [DB Browser for SQLite](https://sqlitebrowser.org/) can be used.

## Testing

You can use cURL or a tool like [Postman](https://www.postman.com/) to test the API.

### Example Curl Commands

You can log in as one of the seeded users with the following curl command:

```bash
curl --location --request POST 'localhost:5000/api/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "thomas",
    "password": "123456"
}'
```

Then you can use the token that comes back from the /login request to make an authenticated request to create a new blog post

```bash
curl --location --request POST 'localhost:5000/api/posts' \
--header 'x-access-token: your-token-here' \
--header 'Content-Type: application/json' \
--data-raw '{
    "text": "This is some text for the blog post...",
    "tags": ["travel", "hotel"]
}'
```
