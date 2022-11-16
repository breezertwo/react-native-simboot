## react-native-simboot

Tired from searching for udids for a new simulator? A colleague wants to see the prototype on his own iPhone just "real quick"?

This script will speed up deploying your ReactNative app to a simulator or a device.
The script searches for any available simulator or device, without having to look for UDID, device names or configurations by your self.

### Install

You can add this package globaly to be able to use it in every project, or install it project by project.

yarn:

```
yarn add react-native-simboot -D
```

npm:

```
npm i --save-dev react-native-simboot
```

### Use

Simply run

```
start-ios
```

in the root folder of your RN project.

Any added arguments will be passed down & appended to the `npx reac-native` command.

### Prerequisites

- iOS: XCode project file must be under `<root>/ios/name.xcodeproj`
- iOS: XCode CLI package

### Example

```
? Pick a device to run the app: …
  iPhone SE (1st gen)
  iPhone SE (2nd generation)
  iPhone 13 Pro
  iPhone 13 Pro Max
  iPhone 13 mini
❯ iPhone 13
  iPod touch (7th generation)
  iPad Pro (9.7-inch)
  iPad (9th generation)
  iPad Air (4th generation)
  iPhone 12 Pro Max
  iPhone SE (3rd generation)
  iPhone 14
  iPhone 14 Plus
  [...]
```

```
✔ Pick a device to run the app: · iPhone 13
? Choose a config: …
❯ Debug
  Release
  Stage
```

```
✔ Pick a device to run the app: · iPhone 13
✔ Choose a config: · Debug
ReactNative build is running... 6 seconds elapsed
```

---

#### Roadmap

- add config to be able to add own paths, settings and device order
- add option to differ between iOS versions
- add script for android support
