// Description: Get configuration from XCode project
import { errorFn } from '../util/errorFn'
import { run } from '../util/runCmd'

export const getConfigurations = async (xcodeprojPath: string) => {
  try {
    const out = await run(`xcodebuild -list -project ${xcodeprojPath} -json`)
    const xcodeConfig = JSON.parse(out)

    if (xcodeConfig?.project?.configurations) {
      return xcodeConfig.project.configurations
    }

    errorFn('[getConfigurations]', 'No configurations found in Xcode project')
  } catch (error) {
    const errorMessage = `
      Couldn't get configurations from Xcode project.
      Make sure you are in the root of your project and ios folder exists.
      If you are using a custom path, make sure its correct.`

    errorFn('[getConfigurations]', errorMessage)
  }
}
