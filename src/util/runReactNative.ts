import { errorFn } from './errorFn'
import { execShellCommand, writeDone, writeTimeElapsed } from '../util/util'

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
    errorFn('[npx react-native run-android]', String(error))
  }
}
