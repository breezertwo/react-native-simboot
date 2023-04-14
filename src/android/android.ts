import { compareVersions, execShellCommand, getAndroidDeviceList, runRN, SimbootConfig } from '../util'
import { parseBuildGradle } from './parseBuildGradle'
import inquirer from 'inquirer'

export const runAndroid = async (buildGradlePath: string, customConfig: SimbootConfig) => {
  console.log('👀 Collecting build information...')
  const { buildTypes, productFlavors, applicationId, gradleFile } = await parseBuildGradle(buildGradlePath)
  const readableDeviceList = await getAndroidDeviceList()

  const { buildType } = await inquirer.prompt<{ buildType: string }>([
    {
      type: 'list',
      name: 'buildType',
      message: ' Pick build type',
      choices: buildTypes
        ? Object.keys(buildTypes).map(type => {
            return {
              name: type,
              value: type,
            } as const
          })
        : [],
    },
  ])

  let flavor: string | undefined
  if (productFlavors && Object.keys(productFlavors).length !== 0) {
    await inquirer
      .prompt<{ flavor: string }>([
        {
          type: 'list',
          name: 'flavor',
          message: ' Pick product flavor',
          choices: productFlavors
            ? Object.keys(productFlavors).map(flavor => {
                return {
                  name: flavor,
                  value: flavor,
                } as const
              })
            : [],
        },
      ])
      .then(answer => {
        flavor = answer.flavor
      })
  }

  // https://github.com/react-native-community/cli/issues/1754
  const rnCliVersion = await execShellCommand(`npx react-native -v`)

  let device: string | undefined
  if (readableDeviceList.length !== 0 && compareVersions(rnCliVersion.replace(/ +/g, ''), '11.0.0') !== -1) {
    await inquirer
      .prompt<{ choice: string }>([
        {
          type: 'list',
          name: 'choice',
          message: ' Pick device',
          choices: readableDeviceList.map(device => {
            return {
              name: device,
              value: device,
            } as const
          }),
        },
      ])
      .then(answer => {
        device = answer.choice
      })
  }

  const flavorSpecificApplicationId = flavor ? gradleFile.android.productFlavors?.[flavor]?.applicationId : undefined

  // The actual command to run
  const command = `npx react-native run-android ${
    buildType ? `--variant=${flavor ? flavor + buildType[0].toUpperCase() + buildType.slice(1) : buildType}` : ''
  } ${applicationId ? `--appId=${flavorSpecificApplicationId || applicationId}` : ''} ${
    device ? `--deviceId=${device}` : ''
  }`

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
