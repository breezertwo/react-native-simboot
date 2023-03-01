import { errorFn } from './errorFn'
import { execShellCommand, writeDone, writeTimeElapsed } from '../util'

export const runRN = async (cmd: string) => {
  let timeElapsed = 0
  const timer = setInterval(() => writeTimeElapsed(++timeElapsed), 1000)

  try {
    await execShellCommand(cmd)
    clearInterval(timer)
    writeDone()
    return
  } catch (error) {
    clearInterval(timer)
    errorFn('[run react-native command]', String(error))
  }
}
