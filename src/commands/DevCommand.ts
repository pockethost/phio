import { debounce } from '@s-libs/micro-dash'
import { deploy, excludeDefaults } from '@samkirkland/ftp-deploy'
import { watch } from 'chokidar'
import { Command } from 'commander'
import { ensureDirSync } from 'fs-extra'
import { config } from '../lib/config'
import { getInstanceBySubdomainCnameOrId } from '../lib/getClient'
import { defaultInstanceId } from './../lib/defaultInstanceId'

async function deployMyCode(
  instanceName: string,
  include: string[],
  exclude: string[]
) {
  const cachePath = '.cache'
  ensureDirSync(cachePath)

  console.log('🚚 Deploy started')
  await deploy({
    server: 'ftp.pockethost.io',
    username: `__auth__`,
    password: config(`auth`)!.token,
    'server-dir': `${instanceName}/`,
    include,
    exclude: [...excludeDefaults, ...exclude],
    'state-name': '.cache/.ftp-deploy-sync-state.json',
    'log-level': 'verbose',
  })
  console.log('🚀 Deploy done!')
}

export const DevCommand = () => {
  return new Command('dev')
    .argument(`[instanceId]`, `Instance name`, defaultInstanceId())
    .description(`Watch for local modifications and sync to remote`)
    .option(
      '-i, --include <include...>',
      'Files to include in the sync',
      (val, prev) => [...prev, val],
      ['pb_*/**/*']
    )
    .option(
      '-e, --exclude <exclude...>',
      'Files to exclude from the sync',
      (val, prev) => [...prev, val],
      [`pb_data/**/*`]
    )
    .action(async (_instanceId, { include, exclude }) => {
      if (!_instanceId) {
        console.error(
          `No instance name provided and none was found in package.json or pockethost.json. Use 'phio link <instance>'`
        )
        process.exit(1)
      }
      console.log(`Dev mode`)

      const instance = await getInstanceBySubdomainCnameOrId(_instanceId)

      const upload = debounce(() => {
        deployMyCode(instance.subdomain, include, exclude).catch(console.error)
      }, 200)

      const watcher = watch(['.'], {
        persistent: true,
        ignored: (file) => {
          const isIgnored = file !== '.' && !file.startsWith('pb_')
          // console.log({ file, isIgnored })
          return isIgnored
        },
      })
      console.log(`Watching for changes in pb_*/**/*`)
      const handle = (path: string, details: any) => {
        upload()
        // internal
        console.log(`Syncing ${path}`)
      }
      watcher.on('add', handle).on('change', handle).on('unlink', handle)
    })
}
