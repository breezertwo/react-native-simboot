#! /usr/bin/env node
const util = require('node:util');
const process = require('node:process');
const exec = util.promisify(require('node:child_process').exec);
const fs = require('fs');
const { Select } = require('enquirer');

const errorFn = (method, msg) => {
  console.log(method);
  console.log(msg);
  process.exit(1);
}

const runIOS = async () => {
  const { stdout: deviceListRaw, error: listError } = await exec('xcrun simctl list --json devices available');
  if (listError) return errorFn("[ERROR]: xcrun simctl list --json devices available", listError);
  const deviceList = JSON.parse(deviceListRaw).devices
  
  const readableDeviceList = []

  for (const key in deviceList) {
    if (key.indexOf("iOS") != -1) {
        const subList = deviceList[key]
        if (Array.isArray(subList) && subList.length > 0) {
          for (const e of subList) {
            readableDeviceList.push({ name: e.name, value: e.udid})
          }
        }
  
    }
  }
  
  const prompt = new Select({
    name: 'device',
    message: 'Pick a device to run the app:',
    choices: readableDeviceList,
    result(value) {
      return this.choices.find(choice => choice.name === value).value;
    }
  });

  const xcodeproj = fs.readdirSync('ios', { withFileTypes: true })
    .map((item) => item.name)
    .filter(item => item.indexOf('xcodeproj') !== -1)[0]

  const { stdout: projectRaw, error: projectError } = await exec(`xcodebuild -list -project ios/${xcodeproj} -json`);
  if (projectError) return errorFn("[ERROR]: getting project info", projectError)
  const configurations = JSON.parse(projectRaw).project.configurations
  
  const promptConfig = new Select({
      name: 'config',
      message: 'Choose a config:',
      choices: configurations,
    });
  
  const udid = await prompt.run()
  const configuration = await  promptConfig.run()

  let timeElapsed = 0;
  const timer = setInterval(() => process.stdout.write(`ReactNative build is running... ${++timeElapsed} seconds elapsed\r`), 1000);

  const { error } = await exec(`npx react-native run-ios --udid ${udid} --configuration "${configuration}"`);

  clearInterval(timer);
  if (error) return errorFn("[ERROR]: npx react-native run-ios", error);

  console.log('\rReactNative build is running... done!');
  process.exit(0);
}

runIOS()

