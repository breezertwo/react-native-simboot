#! /usr/bin/env node
const util = require('node:util')
const process = require('node:process')
const exec = util.promisify(require('node:child_process').exec)
const fs = require('fs')
const { Select } = require('enquirer')

const errorFn = (method, msg) => {
  console.error(`\x1b[31m${method} failed with:\n${msg}`)
  process.exit(1)
}

const runIOS = async () => {
  console.log('🍏 Running iOS script')
  console.log('📱 Collecting infos...')

  const readableDeviceList = []
  try {
    const { stdout } = await exec(`xcrun xctrace list devices 2>&1 | grep -oE 'iPhone.*|iPad.*|iPod.*'`)
    if (stdout.length > 0) {
      var deviceList = stdout.split('\n')
      for (const device of deviceList) {
        if (device.indexOf('Watch') === -1 && device.length > 0) {
          const deviceStats = device.split(' ')
          const deviceUDID = deviceStats[deviceStats.length - 1].replace('(', '').replace(')', '')
          const deviceVersion = deviceStats[deviceStats.length - 2].replace('(', '').replace(')', '')

          const cutOff = device.indexOf('Simulator') !== -1 ? 3 : 2
          deviceStats.splice(deviceStats.length - cutOff, cutOff)
          const deviceName = `${deviceStats.join(' ')} - iOS ${deviceVersion}`

          readableDeviceList.push({ name: deviceName, udid: deviceUDID })
        }
      }
    } else {
      throw new Error('No devices found')
    }
  } catch (error) {
    errorFn('[get device list]', error)
  }

  const prompt = new Select({
    name: 'device',
    message: 'Pick a device to run the app:',
    choices: readableDeviceList,
    result(value) {
      return this.choices.find(choice => choice.name === value).udid
    },
  })

  let configurations = []
  try {
    const xcodeproj = fs
      .readdirSync('ios', { withFileTypes: true })
      .map(item => item.name)
      .filter(item => item.indexOf('xcodeproj') !== -1)[0]

    const { stdout } = await exec(`xcodebuild -list -project ios/${xcodeproj} -json`)
    if (stdout.length > 0) {
      configurations = JSON.parse(stdout).project.configurations
    } else {
      throw new Error('No configurations found')
    }
  } catch (error) {
    errorFn('[get config list]', error)
  }

  const promptConfig = new Select({
    name: 'config',
    message: 'Choose a config:',
    choices: configurations,
  })

  const udid = await prompt.run()
  const configuration = await promptConfig.run()

  let timeElapsed = 0
  const timer = setInterval(
    () => process.stdout.write(`🚧 ReactNative build is running... ${++timeElapsed} seconds elapsed\r`),
    1000,
  )

  try {
    await exec(
      `npx react-native run-ios --udid ${udid} --configuration "${configuration}" ${process.argv.slice(2).join(' ')}`,
    )
    process.stdout.write('🚀 ReactNative build is running... done!')
  } catch (error) {
    clearInterval(timer)
    errorFn('[npx react-native run-ios]', error)
  }

  clearInterval(timer)
  process.exit(0)
}

runIOS()
