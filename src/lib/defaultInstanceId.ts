import { existsSync, readFileSync, writeFileSync } from 'fs'

export const savedInstanceId = () => {
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

export const saveInstanceId = (
  instanceId: string,
  file: 'package.json' | 'pockethost.json'
) => {
  if (!existsSync(file)) {
    // Create new file if it doesn't exist
    const newContent =
      file === 'package.json' ? { pockethost: { instanceId } } : { instanceId }
    writeFileSync(file, JSON.stringify(newContent, null, 2))
    return
  }

  // Update existing file
  const content = JSON.parse(readFileSync(file).toString())

  if (file === 'package.json') {
    content.pockethost = content.pockethost || {}
    content.pockethost.instanceId = instanceId
  } else {
    content.instanceId = instanceId
  }

  writeFileSync(file, JSON.stringify(content, null, 2))
}
