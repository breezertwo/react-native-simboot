## react-native-simboot

Tired from searching for udids for a new simulator? A colleague wants to see the prototype on his own phone just "real quick"?

This script will speed up deploying your ReactNative app to a simulator or a device.
It searches for any available simulator or device, without having to look for UDID or device names by yourself.
The script will also pick up any configured build configurations for your project and let's you choose what you want to build.

### Install

yarn:

```
yarn add -D react-native-simboot
```

npm:

```
npm i -D react-native-simboot
```

### Use

Simply run in the root folder of your RN project:

```
npx react-native simboot --ios      # run ios build
npx react-native simboot --android  # run android build (not ready yet)
```

### Additional flags

#### Specify project path

Usually the project files are located in the ios and android folders. If you have a different structure, you can specify the path to the Xcode project and the Gradle project with these flags.

If you have set the locations in `react-native.config.js`, they should be automatically detected.

```
--ios-xcodeproj-path [string]       # specify custom xcode project path
--android-gradle-path [string]      # specify custom build.gradle path (not ready yet)
```

### Prerequisites

- iOS: XCode Command Line Tools

### Example

```
🏃 Running react-native-simboot
🍏 Running iOS script
🍏 Using iOS project: /<path to project root>/ios/app.xcodeproj
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

- add script for android (wip)
- add config file to for
  - custom device order
  - custom script phase (e.g to set env)
- add option to preselect iOS versions
