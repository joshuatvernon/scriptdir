module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts}', '!**/*.d.ts', '!./*.js'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['lib', 'badges', 'coverage', 'node_modules'],
  coverageReporters: ['json', 'json-summary', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 99,
      functions: 99,
      lines: 99,
      statements: 99
    }
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/src/config/repos/']
};
