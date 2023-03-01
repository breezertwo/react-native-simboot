import { errorFn, execShellCommand } from '../util'

export const getConfigurations = async (xcodeprojPath: string): Promise<string[]> => {
  try {
    const out = await execShellCommand(`xcodebuild -list -project ${xcodeprojPath} -json`)
    const xcodeConfig = JSON.parse(out)

    if (!xcodeConfig?.project?.configurations) {
      console.log('🚨 No configurations found - continuing without')
      return []
    }

    return xcodeConfig.project.configurations
  } catch (error) {
    return errorFn(
      '🚨 [getXCodeConfigurations]',
      'Failed to get configurations from Xcode project.\nCheck if you have XCode CLI tools installed. If you do, check if the project path is correct.',
    )
  }
}
