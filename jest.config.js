module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testEnvironment: 'node',
  testRegex: ['.e2e-spec.ts$', '.spec.ts$', '.test.ts$'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  verbose: true,
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/src/$1',
    '^config(.*)$': '<rootDir>/src/config/$1',
    '^constants(.*)$': '<rootDir>/src/constants/$1',
    '^database(.*)$': '<rootDir>/src/database/$1',
    '^decorators(.*)$': '<rootDir>/src/decorators/$1',
    '^exceptions(.*)$': '<rootDir>/src/exceptions/$1',
    '^interceptors(.*)$': '<rootDir>/src/interceptors/$1',
    '^middlewares(.*)$': '<rootDir>/src/middlewares/$1',
    '^modules(.*)$': '<rootDir>/src/modules/$1',
    '^utils(.*)$': '<rootDir>/src/utils/$1',
  },
}
