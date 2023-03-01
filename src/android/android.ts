import prompts from 'prompts'
import { runRN, SimbootConfig } from '../util'
import { parseBuildGradle } from './parseBuildGradle'

export const runAndroid = async (buildGradlePath: string, customConfig: SimbootConfig) => {
  console.log('👀 Collecting build information...')
  const { buildTypes, productFlavors, applicationId, gradleFile } = await parseBuildGradle(buildGradlePath)

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

  const flavorSpecificApplicationId = gradleFile.android.productFlavors?.[flavor]?.applicationId

  // The actual command to run
  const command = `npx react-native run-android ${
    buildType ? `--variant=${flavor ? flavor + buildType[0].toUpperCase() + buildType.slice(1) : buildType}` : ''
  } ${applicationId ? `--appId=${flavorSpecificApplicationId || applicationId}` : ''}`

  if (customConfig.verbose) {
    console.log('🤖 Using build.gradle:', buildGradlePath)
    console.log('🪪', ' Application ID:', flavorSpecificApplicationId || applicationId)
    console.log('🌶️', ' Product flavor:', flavor)
    console.log('🔧 Build type:', buildType)
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
      android: {
        buildType,
        productFlavor: flavor,
      },
    })
  }

  await runRN(command)

  process.exit(0)
}
