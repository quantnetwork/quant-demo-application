module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testResultsProcessor: '../node_modules/jest-junit-reporter',
};
