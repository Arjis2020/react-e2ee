/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  coverageProvider: "babel",
  moduleFileExtensions: ['ts', 'js'],
  setupFilesAfterEnv: ["<rootDir>/src/setup-tests.ts"],
  preset: 'ts-jest',
  testEnvironment: "jsdom",
};

export default config;
