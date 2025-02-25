import fse from 'fs-extra'
import { type AuthModel } from 'pocketbase'
import { PHIO_HOME } from './constants'

const { readJSONSync, writeJSONSync } = fse
export type Config = {
  email: string
  auth: { record: AuthModel; token: string }
}
export function config<T extends keyof Config>(
  k: T,
  v?: Config[T]
): Config[T] | undefined {
  const configPath = PHIO_HOME('config.json')
  // console.log({ configPath })
  const config = (() => {
    try {
      // console.log(`Reading config`, configPath)
      return readJSONSync(configPath) as Partial<Config>
    } catch (e) {
      // console.warn(`${e}`)
      return {}
    }
  })()
  try {
    if (v !== undefined) {
      config[k] = v
      // console.log(`Writing config`, config, configPath)
      writeJSONSync(configPath, config)
      return v
    }
    return config[k]
  } catch (e) {
    console.error(`${e}`)
  }
}
