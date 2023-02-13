import { spawn } from 'child_process'

export const run = (commandLine: string) =>
  new Promise<string>((resolve, reject) => {
    const [command, ...args] = commandLine.split(/\s+/)

    const child = spawn(command, args)
    const output = [] as string[]

    child.stdout.on('data', chunk => output.push(chunk))

    child.on('close', () => resolve(output.join('').trim()))
    child.on('error', error => reject(error))
  })
