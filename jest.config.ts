import { Config } from 'jest';

const config: Config = {
  roots: [
    '<rootDir>/src'
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}

export default config;