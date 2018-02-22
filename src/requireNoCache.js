/**
 * require modules, but delete require.cache first
 *
 * @flow
 */

export default function forceRequire(mod: string): * {
  delete require.cache[require.resolve(mod)]
  return require(mod)
}
