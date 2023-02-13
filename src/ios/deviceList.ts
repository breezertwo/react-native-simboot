// Description: Get a list of all iOS devices and simulators connected to the machine

import { run } from '../util/runCmd'
import { errorFn } from '../util/errorFn'

export const getDeviceList = async () => {
  const readableDeviceList = []

  try {
    const out = await run('xcrun xctrace list devices')
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
    errorFn('[getDeviceList]', String(error))
  }
}
