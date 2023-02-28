import path from 'path'

export const parseReactNativeConfig = (config: any) => ({
  root: required(config.root, 'root'),
  xcodeprojPath: () => {
    const iosProject = required(config?.project?.ios, 'project.ios')
    return (
      iosProject.xcodeprojPath ||
      path.join(
        required(iosProject.sourceDir, 'project.ios.sourceDir'),
        required(iosProject.xcodeProject, 'project.ios.xcodeProject').name.replace('.xcworkspace', '.xcodeproj'),
      )
    )
  },
  pbxprojPath: () => {
    const iosProject = required(config?.project?.ios, 'project.ios')

    return (
      iosProject.pbxprojPath ||
      path.join(
        required(iosProject.sourceDir, 'project.ios.sourceDir'),
        required(iosProject.xcodeProject, 'project.ios.xcodeProject').name.replace('.xcworkspace', '.xcodeproj'),
        'project.pbxproj',
      )
    )
  },
  buildGradlePath: () => {
    const androidProject = required(config?.project?.android, 'project.android')

    return path.join(
      required(androidProject.sourceDir, 'project.android.sourceDir'),
      required(androidProject.appName, 'project.android.appName'),
      'build.gradle',
    )
  },
})

const required = <T>(value: T, name: string): NonNullable<T> => {
  if (!value) {
    throw new Error(`Missing required value: ${name}, found: ${value}`)
  }

  return value!
}
