// Description: Get configuration from XCode project
import { run } from '../util/runCmd'

export const getConfigurations = async (xcodeprojPath: string): Promise<string[]> => {
  try {
    const out = await run(`xcodebuild -list -project ${xcodeprojPath} -json`)
    const xcodeConfig = JSON.parse(out)

    if (!xcodeConfig?.project?.configurations) {
      throw new Error('No configurations found in Xcode project')
    }

    return xcodeConfig.project.configurations
  } catch (error) {
    const errorMessage = `
      Couldn't get configurations from Xcode project.
      Make sure you are in the root of your project and ios folder exists.
      If you are using a custom path, make sure its correct.`
    throw new Error(errorMessage)
  }
}
