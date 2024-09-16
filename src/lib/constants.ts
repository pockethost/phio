import envPaths from 'env-paths'
import env from 'env-var'
import { ensureDirSync } from 'fs-extra/esm'
import { join } from 'path'

export const PHIO_HOME = (...paths: string[]) =>
  join(
    env.get('PHIO_HOME').default(envPaths(`phio`).config).asString(),
    ...paths
  )
ensureDirSync(PHIO_HOME())

export const PHIO_MOTHERSHIP_URL = (...paths: string[]) => {
  const url = new URL(
    env
      .get(`PHIO_MOTHERSHIP_URL`)
      .default(`https://pockethost-central.pockethost.io`)
      .asString()
  )
  url.pathname = join(url.pathname, ...paths)
  return url.toString()
}
