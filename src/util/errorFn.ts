export const errorFn = (method: string, msg?: string) => {
  console.error(`\x1b[31m${method}${msg ? `: ${msg}` : ''}\x1b[0m`)
  process.exit(1)
}
