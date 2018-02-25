/**
 * write file return a promise
 *
 * @flow
 */

import fs from 'fs'

export default function writeFilePromise(path: string,
                                         content: Buffer | string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, err => {
      if(err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}
