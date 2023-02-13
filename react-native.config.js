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
          name: '--help',
          description: 'Here should be help',
        },
        {
          name: '--ios',
          description: 'Run iOS simulator',
        },
        {
          name: '--ios-xcodeproj-path [string]',
          description: 'Path to iOS Xcode project',
        },
      ],
    },
  ],
}
