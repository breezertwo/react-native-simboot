import * as readline from 'readline'
import { exec } from 'child_process'

export const writeTimeElapsed = (timeElapsed: number, ended?: boolean) => {
  readline.clearLine(process.stdout, 0)
  readline.cursorTo(process.stdout, 0, undefined)
  process.stdout.write(`🚧 ReactNative build is running... ${timeElapsed} seconds elapsed`)
}

export const writeDone = () => {
  readline.clearLine(process.stdout, 0)
  readline.cursorTo(process.stdout, 0, undefined)
  console.log(`🚀 ReactNative build finished successfully`)
}

export const execShellCommand = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error(error)
        reject(error)
      }

      resolve(stdout ? stdout : stderr)
    })
  })
}
