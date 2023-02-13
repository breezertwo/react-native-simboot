//import { parse } from 'xcparse'
import fs from 'fs'
import { runAndroid } from './android/android'
import { runIOS } from './ios/ios'
import { parseConfig } from './util/parseConfig'

interface Args {
  ios?: boolean
  android?: boolean
  iosXcodeprojPath?: string
  androidBuildGradlePath?: string
}

export const simboot = async (config: unknown, args: Args) => {
  console.log('🏃 Running react-native-simboot')
  const rnConfig = parseConfig(config)

  if (args.ios) {
    console.log('🍏 Running iOS script')
    console.log('🍏 Using iOS project:', rnConfig.xcodeprojPath())

    await runIOS(args.iosXcodeprojPath || rnConfig.xcodeprojPath())
  }

  if (args.android) {
    console.log('📱 Running android script')
    console.log('📱 Using android project:', rnConfig.buildGradlePath())

    await runAndroid(args.androidBuildGradlePath || rnConfig.buildGradlePath())
  }
}
