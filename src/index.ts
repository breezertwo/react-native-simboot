//(#!/usr/bin/env node)
import { runIOS } from './ios/ios'

import path from 'path'
import fs from 'fs'
import { parse } from 'xcparse'
import { parseConfig } from './util/info'

export const simboot = async (config: any, args: any) => {
  console.log('🏃 Running boot script')

  const info = parseConfig(config)

  console.log('📱 Collecting infos... ☕️')
  console.log('📱 Project root:', info.root)

  if (args.ios) {
    console.log('🍏 Running iOS script')

    await runIOS(args.iosXcodeprojPath || info.xcodeprojPath())

    //console.log('🕗 Reading pbxproj...')
    //const pbxproj = parse(fs.readFileSync(info.pbxprojPath()).toString())
  }

  if (args.android) {
    console.log('📱 Android project:', info.buildGradlePath())
  }
}
