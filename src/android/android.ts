var g2js = require('gradle-to-js/lib/parser')

export const runAndroid = async (buildGradlePath: string) => {
  await g2js.parseFile(buildGradlePath).then((representation: any) => {
    console.log(representation)
  })
}
