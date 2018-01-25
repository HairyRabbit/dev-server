/**
 * require modules, but delete require.cache first
 *
 * @flow
 */

export default function required(mod: string): * {
  delete require.cache[require.resolve(mod)]
  return require(mod)
}
