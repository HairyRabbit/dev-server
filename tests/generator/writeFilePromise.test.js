/**
 * @jest
 */

beforeEach(() => {
  jest.resetModules()
})

function mockFs(err) {
  jest.doMock('fs', () => {
    return {
      writeFile(_1, _2, cb) {
        cb(err)
      }
    }
  })
}

test('should promise resolved', () => {
  mockFs(undefined)
  const writeFilePromise = require('../../src/generator/writeFilePromise').default
  return expect(writeFilePromise()).resolves.toBe()
})

test('should promise rejected', () => {
  mockFs(true)
  const writeFilePromise = require('../../src/generator/writeFilePromise').default
  return expect(writeFilePromise()).rejects.toBe(true)
})
