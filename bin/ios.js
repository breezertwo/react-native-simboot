#! /usr/bin/env node
var shell = require('shelljs');
var fs = require('fs');
const { Select } = require('enquirer');

const runIOS = async () => {
  const deviceListRaw = shell.exec('xcrun simctl list --json devices available', { silent: true });
  if (deviceListRaw.stderr.length > 0) return
  const deviceList = JSON.parse(deviceListRaw.stdout).devices
  
  const readableDeviceList = []

  for (key in deviceList) {
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

  const projectRaw = shell.exec(`xcodebuild -list -project ios/${xcodeproj} -json`, { silent: true });
  if (projectRaw.stderr.length > 0) return
  const configurations = JSON.parse(projectRaw.stdout).project.configurations
  
  const promptConfig = new Select({
      name: 'config',
      message: 'Choose a config:',
      choices: configurations,
    });
  
  const udid = await prompt.run()
  const configuration = await  promptConfig.run()
  
  shell.exec(`react-native run-ios --udid ${udid} --configuration ${configuration}"`)
}

runIOS()

