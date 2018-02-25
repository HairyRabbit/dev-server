/**
 * write template to fs
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { sync as mkdirp } from 'mkdirp'
import { sync as rimraf } from 'rimraf'
import write from './writeFilePromise'
import type { Options } from '../../'

type FileName = string
type Content = string
type TemplateTuple = [ FileName, Content ]

export default function templateWrite(sourceDir: string, override: boolean) {
  return function templateWrite1(name: string, contents: Array<TemplateTuple>): Promise<void> {
    /**
     * test target dir useable
     */
    const targetDir = path.resolve(sourceDir, name)
    const isTargetExists = fs.existsSync(targetDir)

    if(isTargetExists) {
      const isDirNotEmpty = Boolean(fs.readdirSync(targetDir).length)
      if(isDirNotEmpty) {
        if(override) {
          console.warn(`Warning: src/${name} exists, Override...`)
        } else {
          console.log(`Warning: src/${name} exists, Skip...`)
          return Promise.resolve()
        }
      }
    } else {
      mkdirp(targetDir)
    }

    const backups = {}
    const skips = []

    return Promise.all(contents.map(tuple => {
      const [ fileName, content ] = tuple
      const filePath: string = path.resolve(targetDir, fileName)
      const isExists: boolean = fs.existsSync(filePath)
      if(isExists) {
        if(!override) {
          skips.push(tuple)
          return Promise.resolve()
        }
        backups[filePath] = fs.readFileSync(filePath)
      }
      return write(filePath, content)
    })).then(report).catch(rollback)

    function report(): void {
      let out: string = ''
      out += format(contents, 'green', '✓', 'created')
      out += format(skips, 'blue', '●', 'skipped')

      console.log('templates genreate successful:')
      console.log('\n' + out + '\n')
    }


    function rollback(): void {
      if(!isTargetExists) {
        rimraf(targetDir)
        return
      }

      contents.forEach(([ fileName ]) => {
        const filePath: string = path.resolve(targetDir, fileName)
        rimraf(filePath)

        const backupedFile: Buffer = backups[filePath]
        if(Boolean(backupedFile)) {
          fs.writeFileSync(filePath, backupedFile)
        }
      })
    }
  }
}

export function format(list: Array<TemplateTuple>,
                       color: string,
                       flag: string,
                       text: string): string {
  return list.map(([ fileName ]) => {
    return `  ${chalk[color](flag)} ${fileName} ${chalk[color](text)}`
  }).join('\n')
}
