/**
 * @jest
 */

test('should not be undefined', () => {
  const defaultPaths = require('../src/defaultPaths').default
  expect(defaultPaths).not.toBe(undefined)
})
