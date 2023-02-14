import { execShellCommand } from '../util/util'
interface Device {
  name: string
  udid: string
}

export const getDeviceList = async (): Promise<Device[]> => {
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

    return readableDeviceList
  } catch (error) {
    throw new Error(String(error))
  }
}
