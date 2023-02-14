const { simboot } = require('./lib/index.js')

module.exports = {
  commands: [
    {
      name: 'simboot',
      func: (_, config, args) => {
        simboot(config, args)
      },
      options: [
        {
          name: '--ios',
          description: 'Run iOS simulator',
        },
        {
          name: '--ios-xcodeproj-path [string]',
          description: 'Path to iOS Xcode project',
        },
        {
          name: '--android',
          description: 'Run Android emulator',
        },
        {
          name: '--android-gradle-path [string]',
          description: 'Path to Android Gradle project',
        },
      ],
    },
  ],
}
