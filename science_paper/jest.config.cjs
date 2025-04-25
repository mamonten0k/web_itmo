/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  testMatch: [
    '**/tests/**/*.test.ts',
  ],
  collectCoverageFrom: [
    'client/**/*.ts',
    'server/**/*.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^../../client/services/api_service$': '<rootDir>/__mocks__/client/services/api_service.js',
    '^../../client/selectors$': '<rootDir>/__mocks__/client/selectors/index.js',
    '^../../server/controllers/web_vitals_controller$': '<rootDir>/__mocks__/server/controllers/web_vitals_controller.js',
    '^../../common/types$': '<rootDir>/__mocks__/common/types.js',
  },
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['**/tests/client/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/client-setup.js'],
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['**/tests/server/**/*.test.ts', '**/tests/integration/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/server-setup.js'],
    },
  ],
};
