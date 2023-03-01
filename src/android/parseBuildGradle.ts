const g2js = require('gradle-to-js/lib/parser')

interface ProductFlavors {
  [key: string]: {
    [key: string]: string | undefined
    applicationId?: string
  }
}

interface BuildTypes {
  [key: string]: {
    [key: string]: string
  }
}

interface BuildGradle {
  android: {
    defaultConfig: {
      applicationId: string
    }
    productFlavors?: ProductFlavors
    buildTypes?: BuildTypes
  }
}

interface BuildGradleResults {
  productFlavors?: ProductFlavors
  buildTypes?: BuildTypes
  applicationId?: string
  gradleFile: BuildGradle
}

export const parseBuildGradle = async (buildGradlePath: string): Promise<BuildGradleResults> =>
  await g2js.parseFile(buildGradlePath).then(async (gradleFile: BuildGradle) => {
    const productFlavors = gradleFile.android.productFlavors
    const buildTypes = gradleFile.android.buildTypes
    const applicationId = gradleFile.android.defaultConfig?.applicationId

    if (!applicationId) console.log('🪪', ' No application id found - continuing without (this is fine)')
    if (!productFlavors) console.log('🌶️', ' No product flavors found - continuing without')
    if (!buildTypes) console.log('🔧', 'No build types found - continuing without')

    if (!productFlavors && !buildTypes && !applicationId) {
      console.log(
        '🚨 No build information found - check build.gradle file if you are using productFlavors, buildTypes or applicationId and missing them',
      )
      console.log('🚨 Script will run "npx react-native run-android" without any additional parameters')
    }

    return {
      productFlavors,
      buildTypes,
      applicationId,
      gradleFile,
    }
  })
