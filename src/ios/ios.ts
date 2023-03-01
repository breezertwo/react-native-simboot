import prompts from 'prompts'
import { platform } from 'node:process'

import { getConfigurations } from './configuration'
import { getIosDeviceList, runRN, SimbootConfig } from '../util'

export const runIOS = async (xcodeprojPath: string, customConfig: SimbootConfig) => {
  console.log('👀 Collecting build information')

  if (platform !== 'darwin') {
    console.log('🚨 XCode CLI is not supported on this platform')
    process.exit(1)
  }

  const configs = await getConfigurations(xcodeprojPath)
  const readableDeviceList = await getIosDeviceList()

  if (readableDeviceList.length === 0 && configs.length === 0) {
    console.log('🚨 No build information found')
    console.log('🚨 Script will run "npx react-native run-ios" without any additional parameters')
  }

  const { config, uuid } = await prompts([
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
      name: 'uuid',
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

  // The actual command to run
  const command = `npx react-native run-ios ${uuid ? `--udid ${uuid}` : ''} ${
    config ? `--configuration ${config}` : ''
  }`

  if (customConfig.verbose) {
    console.log('🔘 Selected options: ')
    console.log('🍏 Using iOS project:', xcodeprojPath)
    console.log('🔧 Using configuration:', config)
    console.log('📱 Using device:', readableDeviceList.find(d => d.udid === uuid)?.name, '-', uuid)
    console.log('📄 Custom script phase:', !!customConfig.customScriptPhase)
    console.log('🤖 Command:', command)
  }

  if (customConfig.dryRun) {
    console.log('🚧 Dry run, not executing command')
    process.exit(0)
  }

  if (customConfig.customScriptPhase) {
    console.log('🔨 Running custom script phase...')
    await customConfig.customScriptPhase({
      ios: {
        configuration: config,
        device: {
          name: readableDeviceList.find(d => d.udid === uuid)?.name || 'no selected device',
          udid: uuid || 'no selected device',
        },
      },
    })
  }

  await runRN(command)

  process.exit(0)
}
