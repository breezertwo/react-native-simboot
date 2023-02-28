import prompts from 'prompts'

import { getConfigurations } from './configuration'
import { getIosDeviceList, runRN, SimbootConfig } from '../util'

export const runIOS = async (xcodeprojPath: string, customConfig: SimbootConfig) => {
  console.log('👀 Collecting build information')
  const configs = await getConfigurations(xcodeprojPath)

  const readableDeviceList = await getIosDeviceList()

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

  if (customConfig.customScriptPhase) {
    console.log('🔨 Running custom script phase...')
    await customConfig.customScriptPhase({
      ios: {
        configuration: config,
        device,
      },
    })
  }

  await runRN(`npx react-native run-ios --udid ${device} --configuration ${config}`)

  process.exit(0)
}
