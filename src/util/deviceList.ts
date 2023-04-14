import { errorFn } from './errorFn'
import { execShellCommand } from './util'
interface Device {
  name: string
  udid: string
}

export const getIosDeviceList = async (): Promise<Device[]> => {
  const readableDeviceList = []

  try {
    const out = await execShellCommand('xcrun xctrace list devices')
    const deviceList = out?.split('\n')

    for (const device of deviceList) {
      const contains = new RegExp('(iPhone|iPad|iPod)').test(device)
      const containsWatch = new RegExp('Watch').test(device)

      if (contains && !containsWatch) {
        const deviceStats = device.split(' ')
        const deviceUDID = deviceStats[deviceStats.length - 1].replace('(', '').replace(')', '')
        const deviceVersion = deviceStats[deviceStats.length - 2].replace('(', '').replace(')', '')
        const cutOff = device.indexOf('Simulator') !== -1 ? 3 : 2
        deviceStats.splice(deviceStats.length - cutOff, cutOff)
        const deviceName = `${deviceStats.join(' ')} - iOS ${deviceVersion}`
        readableDeviceList.push({ name: deviceName, udid: deviceUDID })
      }
    }

    if (readableDeviceList.length === 0) {
      return errorFn('🚨 No devices found - continuing without')
    }

    return readableDeviceList
  } catch (error) {
    return errorFn('🚨 [getIosDeviceList]', 'Failed to get device list.\nCheck if you have XCode CLI tools installed.')
  }
}

export const getAndroidDeviceList = async (): Promise<string[]> => {
  try {
    const [, ...deviceList] = (await execShellCommand('adb devices')).split('\n')
    const availableDevices = deviceList.filter(line => line.includes('device')).map(line => line.split('\t')[0])
    return availableDevices
  } catch (error) {
    throw new Error(String(error))
  }
}
