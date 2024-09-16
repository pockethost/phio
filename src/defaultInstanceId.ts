import { existsSync, readFileSync } from 'fs'

export const defaultInstanceId = () => {
  if (existsSync('package.json')) {
    const pkg = JSON.parse(readFileSync('package.json').toString())
    if (pkg.pockethost?.instanceId) {
      return pkg.pockethost.instanceId
    }
  }
  if (existsSync('pockethost.json')) {
    const pkg = JSON.parse(readFileSync('pockethost.json').toString())
    if (pkg.instanceId) {
      return pkg.instanceId
    }
  }
  return null
}
