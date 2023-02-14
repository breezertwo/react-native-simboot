import prompts from 'prompts'
import * as readline from 'readline'

import { errorFn } from '../util/errorFn'
import { getConfigurations } from './configuration'
import { getDeviceList } from './deviceList'
import { execShellCommand, writeDone, writeTimeElapsed } from '../util/util'

export const runIOS = async (xcodeprojPath: string) => {
  console.log('👀 Collecting build information')
  const configs = await getConfigurations(xcodeprojPath)
  //console.log('Configurations found:', configs)

  const readableDeviceList = await getDeviceList()
  //console.log('Devices found:', readableDeviceList)

  const { config, device } = await prompts([
    {
      type: 'select',
      name: 'config',
      message: ' Pick configuration',
      instructions: false,
      choices: configs.map(config => {
        return {
          title: config,
          value: config,
        } as const
      }),
    },
    {
      type: 'select',
      name: 'device',
      message: ' Pick device',
      instructions: false,
      choices: readableDeviceList.map(device => {
        return {
          title: device.name,
          value: device.udid,
        } as const
      }),
    },
  ])

  let timeElapsed = 0
  const timer = setInterval(() => writeTimeElapsed(++timeElapsed), 1000)

  try {
    await execShellCommand(`npx react-native run-ios --udid ${device} --configuration ${config}`)
    clearInterval(timer)
    writeDone()
  } catch (error) {
    clearInterval(timer)
    errorFn('[npx react-native run-ios]', String(error))
  }

  process.exit(0)
}
