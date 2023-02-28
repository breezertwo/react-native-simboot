import prompts from 'prompts'

import { getAndroidDeviceList } from '../util/deviceList'
import { errorFn } from '../util/errorFn'
import { execShellCommand, writeDone, writeTimeElapsed } from '../util/util'

var g2js = require('gradle-to-js/lib/parser')

interface AndroidConfig {
  android: {
    defaultConfig: {
      applicationId: string
      flavorDimensions: string
    }
    productFlavors: {
      [key: string]: {
        applicationId?: string
        [key: string]: string | undefined
      }
    }
    buildTypes: {
      [key: string]: {
        [key: string]: string
      }
    }
  }
}

export const runAndroid = async (buildGradlePath: string) => {
  console.log('👀 Collecting build information...')
  await g2js.parseFile(buildGradlePath).then(async (representation: Partial<AndroidConfig>) => {
    const productFlavors = representation?.android?.productFlavors
    const buildTypes = representation?.android?.buildTypes
    let applicationId = representation?.android?.defaultConfig?.applicationId

    if (!productFlavors) console.log('🌶️ No product flavors found - continuing without')
    if (!buildTypes) console.log('🔧 No build types found - continuing without')
    if (!applicationId) console.log('🪪 No application id found - continuing without')

    if (!productFlavors && !buildTypes && !applicationId) {
      console.log(
        '🚨 No build information found - check build.gradle file if you are using productFlavors, buildTypes or applicationId and you are missing them',
      )
      console.log('🚨 Script will run "npx react-native run-android" without any additional parameters')
    }

    // Currently not possible: https://github.com/react-native-community/cli/issues/1754
    // const readableDeviceList = await getAndroidDeviceList()

    const { buildType, flavor } = await prompts([
      {
        type: 'select',
        name: 'buildType',
        message: ' Pick build type',
        instructions: false,
        choices: buildTypes
          ? Object.keys(buildTypes).map(type => {
              return {
                title: type,
                value: type,
              } as const
            })
          : [],
      },
      {
        type: 'select',
        name: 'flavor',
        message: ' Pick product flavor',
        instructions: false,
        choices: productFlavors
          ? Object.keys(productFlavors).map(flavor => {
              return {
                title: flavor,
                value: flavor,
              } as const
            })
          : [],
      },
      // {
      //   type: 'select',
      //   name: 'device',
      //   message: ' Pick device',
      //   instructions: false,
      //   choices: readableDeviceList.map(device => {
      //     return {
      //       title: device,
      //       value: device,
      //     } as const
      //   }),
      // },
    ])

    const flavorSpecificApplicationId = representation?.android?.productFlavors?.[flavor]?.applicationId
    if (flavorSpecificApplicationId) {
      applicationId = flavorSpecificApplicationId
    }

    let timeElapsed = 0
    const timer = setInterval(() => writeTimeElapsed(++timeElapsed), 1000)

    try {
      const cmd = `npx react-native run-android ${
        buildType ? `--variant=${flavor ? flavor + buildType[0].toUpperCase() + buildType.slice(1) : buildType}` : ''
      } ${applicationId ? `--appId=${applicationId}` : ''}`

      await execShellCommand(cmd)
      clearInterval(timer)
      writeDone()
    } catch (error) {
      clearInterval(timer)
      errorFn('[npx react-native run-android]', String(error))
    }

    process.exit(0)
  })
}
