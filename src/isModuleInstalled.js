/**
 * is module install
 *
 * @flow
 */

export default function isModuleInstalled(name: string): boolean {
  try {
    const path = require.resolve(name)
    return true
  } catch(error) {
    return false
  }
}
