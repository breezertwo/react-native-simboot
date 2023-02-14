export const errorFn = (method: string, msg: string) => {
  console.error(`\x1b[31m${method} failed with:\n${msg}`)
  process.exit(1)
}
