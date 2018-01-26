/**
 * @jest
 */

test('should inject foo, when entry be a string', () => {
  const inject = require('../src/entryInjecter').default
  const wopt = { entry: 'foo' }
  const ins = 'bar'
  inject(wopt, ins)
  expect(wopt.entry).toEqual(['bar', 'foo'])
})

test('should inject foo, when entry be a object', () => {
  const inject = require('../src/entryInjecter').default
  const wopt = { entry: { foo: 'foo', bar: 'bar' } }
  const ins = 'baz'
  inject(wopt, ins)
  expect(wopt.entry).toEqual({ foo: ['baz', 'foo'], bar: ['baz', 'bar'] })
})

test('should inject foo, when entry be a function', () => {
  const inject = require('../src/entryInjecter').default
  const cb = jest.fn()
  const wopt = { entry: cb }
  const ins = 'baz'
  inject(wopt, ins)
  expect(cb).toBeCalled()
})

test('should inject foo, when multi tasks', () => {
  const inject = require('../src/entryInjecter').default
  const wopt = [{ entry: 'foo' }, { entry: 'bar' }]
  const ins = 'baz'
  inject(wopt, ins)
  expect(wopt).toEqual([{ entry: ['baz', 'foo'] }, { entry: ['baz', 'bar'] }])
})

test('should inject foo, when injects be a array', () => {
  const inject = require('../src/entryInjecter').default
  const wopt = { entry: 'foo' }
  const ins = ['bar']
  inject(wopt, ins)
  expect(wopt.entry).toEqual(['bar', 'foo'])
})
