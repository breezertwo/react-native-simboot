#! /usr/bin/env node
const util = require('node:util');
const process = require('node:process');
const exec = util.promisify(require('node:child_process').exec);
const fs = require('fs');
const { Select } = require('enquirer');

const errorFn = (method, msg) => {
  console.error(`\x1b[31m${method} failed with:\n${msg}`);
  process.exit(1);
}

const runIOS = async () => {
  console.log('Running iOS...\nCollecting devices...');

  const readableDeviceList = []
  try {
    const { stdout } = await exec('xcrun simctl list --json devices available');
    if (stdout.length > 0) {
      const deviceList = JSON.parse(stdout).devices

      for (const key in deviceList) {
        if (key.indexOf("iOS") != -1) {
            const subList = deviceList[key]
            if (Array.isArray(subList) && subList.length > 0) {
              for (const device of subList) {
                readableDeviceList.push({ name: device.name, udid: device.udid})
              }
            }
      
        }
      }
    } else {
      throw new Error('No devices found');
    }
  } catch (error) {
    errorFn("[get device list]", error)
  }

  const prompt = new Select({
    name: 'device',
    message: 'Pick a device to run the app:',
    choices: readableDeviceList,
    result(value) {
      return this.choices.find(choice => choice.name === value).udid;
    }
  });

  const xcodeproj = fs.readdirSync('ios', { withFileTypes: true })
    .map((item) => item.name)
    .filter(item => item.indexOf('xcodeproj') !== -1)[0]

    let configurations = []
    try {
      const { stdout }  = await exec(`xcodebuild -list -project ios/${xcodeproj} -json`);
      if (stdout.length > 0) {
        configurations = JSON.parse(stdout).project.configurations
      } else {
        throw new Error("No configurations found")
      }
    } catch (error) {
      errorFn("[get config list]", error)
    }


  const promptConfig = new Select({
      name: 'config',
      message: 'Choose a config:',
      choices: configurations,
    });
  
  const udid = await prompt.run()
  const configuration = await promptConfig.run()

  let timeElapsed = 0;
  const timer = setInterval(() => process.stdout.write(`ReactNative build is running... ${++timeElapsed} seconds elapsed\r`), 1000);

  try {
    await exec(`npx react-native run-ios --udid ${udid} --configuration "${configuration}" ${process.argv.slice(2).join(' ')}`);
    console.log('\rReactNative build is running... done!');
    process.exit(0);
  } catch (error) {
    clearInterval(timer);
    errorFn("[npx react-native run-ios]", error)
  }
}

runIOS()

