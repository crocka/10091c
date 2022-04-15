const globals = require('@jest/globals');
const { SYSTEM_TIME } = require('./utils');
const seed = require('../src/db/seed');

// Freeze system time.
globals.jest.useFakeTimers().setSystemTime(new Date(SYSTEM_TIME).getTime());

// Seed db before each test case.
globals.beforeEach(async () => {
  await seed();
});
