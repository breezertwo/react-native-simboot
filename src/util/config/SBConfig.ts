import fs from 'fs'

interface Results {
  android?: {
    buildType?: string
    productFlavor?: string
  }
  ios?: {
    configuration?: string
    device?: {
      name: string
      udid: string
    }
  }
}

export interface SimbootConfig {
  verbose?: boolean
  dryRun?: boolean
  customScriptPhase?: (selction: Results) => void
}

export const parseConfig = (path: any): SimbootConfig => {
  if (!fs.existsSync(path)) return {}

  const config = require(path)

  if (config.customScriptPhase && typeof config.customScriptPhase !== 'function') {
    console.log('🚨 customScriptPhase must be a function')
    process.exit(1)
  }

  if (config.verbose && typeof config.verbose !== 'boolean') {
    console.log('🚨 verbose must be a boolean')
    process.exit(1)
  }

  if (config.verbose) console.log('📄 Successfully parsed simboot.config.js')

  return {
    verbose: config.verbose || false,
    dryRun: config.dryRun || false,
    customScriptPhase: config.customScriptPhase,
  }
}
