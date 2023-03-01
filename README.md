# react-native-simboot

Tired from searching an UUID or deviceID after adding a new simulator? A colleague wants to see the prototype on his own phone just "real quick"? Confused about the different build configurations in your project?

This script will speed up deploying your ReactNative app to a simulator or a device for testing.

It automatically searches for any available simulator or device. (iOS only at the moment)
The script will pick up any available build configuration from Xcode (iOS) or the productFlavor and buildType variants from build.gradle (Android) and let you choose which one you want to run your app with.

After the prompt, the script will run the `react-native run-<os>` command and start the app on the selected device.

## Install

yarn:

```
yarn add -D react-native-simboot
```

npm:

```
npm i -D react-native-simboot
```

## Use

Simply run in the root folder of your RN project:

```
npx react-native simboot --ios      # run ios build
npx react-native simboot --android  # run android build
```

### Prerequisites

If you are developing react-native apps on your machine, you should have the following tools already installed:

- iOS: [XCode Command Line Tools](https://developer.apple.com/library/archive/technotes/tn2339/_index.html) (xcodebuild, xcrun)
- Android: [Android Debug Bridge](https://developer.android.com/studio/command-line/adb) (adb)

### Additional flags

#### Specify project path

Usually the project files are located in the ios and android folders. If you have a different structure, you can specify the path to the Xcode project and the Gradle project with these flags.

If you have set the locations in `react-native.config.js`, they should be automatically detected.

```
--ios-xcodeproj-path [string]       # specify custom xcode project path
--android-gradle-path [string]      # specify custom build.gradle path
```

#### Flags set by script for run-android and run-ios and how they are used

| Flag            | Info                                                                                           | OS      |
| --------------- | ---------------------------------------------------------------------------------------------- | ------- |
| --uuid          | From selection                                                                                 | iOS     |
| --configuration | From selection                                                                                 | iOS     |
| --variant       | Composed from productFlavor & buildType selection                                              | android |
| --appId         | Taken from defaultConfig in build.gradle. Overwritten if value set in choosen productFlavor    | android |
| --deviceId      | Currently not enabled (see [Issue](https://github.com/react-native-community/cli/issues/1754)) | android |

## Config file

You can configure the script by adding a `simboot.config.js` file to the root of your project.

| Value             | Type                             | Explanation                                                                                                                    |
| ----------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| verbose           | boolean                          | get detailed output                                                                                                            |
| dryRun            | boolean                          | don't run any build after selection                                                                                            |
| customScriptPhase | (config: SelectedConfig) => void | run custom script after selection but before react-native build (e.g to set env). `config` contains the selected configuration |

Depending on the operating system selected, the `customScriptPhase` function will be called with `config` containing the following values:

```ts
interface SelectedConfig {
  ios: {
    configuration?: string
    device?: {
      name: string
      udid: string
    }
  }
}
```

```ts
interface SelectedConfig {
  android: {
    buildType?: string
    productFlavor?: string
  }
}
```

## Example (iOS)

```
🏃 Running react-native-simboot
🍏 Running iOS script
👀 Collecting build information

✔ Pick configuration:
❯ Debug
  Release
  Stage

✔ Pick a device:
  iPad Pro (12.9-inch) (6th generation) - iOS 16.2
  iPad Pro (9.7-inch) - iOS 15.0
  iPad mini (6th generation) - iOS 15.0
  iPad mini (6th generation) - iOS 16.2
❯ iPhone 13 - iOS 15.0
  iPhone 13 Pro - iOS 15.0
  iPhone 13 Pro Max - iOS 15.0
  iPhone 13 mini - iOS 15.0
↓ iPhone 14 - iOS 16.2

🚀 ReactNative build finished successfully
```

#### Roadmap

- add config option for
  - preselect device types
  - preselect iOS versions
- enable android device selection ([issue](https://github.com/react-native-community/cli/issues/1754))
