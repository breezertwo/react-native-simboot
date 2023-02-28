import { runAndroid } from './android/android'
import { runIOS } from './ios/ios'
import { parseReactNativeConfig, parseConfig } from './util'

interface Args {
  ios?: boolean
  android?: boolean
  iosXcodeprojPath?: string
  androidBuildGradlePath?: string
}

export const simboot = async (config: unknown, args: Args) => {
  console.log('🏃 Running react-native-simboot')
  const rnConfig = parseReactNativeConfig(config)
  const simbootConfig = parseConfig(rnConfig.root + '/simboot.config.js')

  if (args.ios) {
    console.log('🍏 Running iOS script')
    console.log('🍏 Using iOS project:', rnConfig.xcodeprojPath())

    await runIOS(args.iosXcodeprojPath || rnConfig.xcodeprojPath(), simbootConfig)
  }

  if (args.android) {
    console.log('🤖 Running android script')
    console.log('🤖 Using android build.gradle:', rnConfig.buildGradlePath())

    await runAndroid(args.androidBuildGradlePath || rnConfig.buildGradlePath(), simbootConfig)
  }
}
