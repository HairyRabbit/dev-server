/**
 * test current env is match target env
 *
 * @flow
 */

export default function isEnv(test: string): Function {
  return (target: string): boolean => {
    if(test === target) {
      return true
    } else {
      const regex = new RegExp(test)
      return regex.test(target)
    }
  }
}
