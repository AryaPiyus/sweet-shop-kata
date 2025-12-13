/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Explicitly looks for .test.ts files inside the src folder
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  // Cleans up console output
  verbose: true,
  // Handles TypeScript paths if you use them (optional but safe to keep)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Ensure we don't try to test build artifacts
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};