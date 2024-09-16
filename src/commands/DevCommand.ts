import { debounce } from '@s-libs/micro-dash'
import { deploy } from '@samkirkland/ftp-deploy'
import { watch } from 'chokidar'
import { Command } from 'commander'
import { ensureDirSync } from 'fs-extra'
import { config } from '../lib/config'
import { defaultInstanceId } from './../lib/defaultInstanceId'
import { getClient } from './../lib/getClient'

async function deployMyCode(instanceName: string) {
  const cachePath = '.cache'
  ensureDirSync(cachePath)

  console.log('🚚 Deploy started')
  await deploy({
    server: 'ftp.pockethost.io',
    username: `__auth__`,
    password: config(`auth`)!.token,
    'server-dir': `${instanceName}/`,
    exclude: ['*', '!pb_*/**/*'],
    'state-name': '.cache/.ftp-deploy-sync-state.json',
    'log-level': 'verbose',
  })
  console.log('🚀 Deploy done!')
}

export const DevCommand = () => {
  return new Command('dev')
    .argument(`[instanceId]`, `Instance name`, defaultInstanceId())
    .description(`Watch for local modifications and sync to remote`)
    .action(async (_instanceId) => {
      if (!_instanceId) {
        console.error(
          'No instance name provided and none was found in package.json or pockethost.json'
        )
        process.exit(1)
      }

      const client = getClient()

      const instance = await client
        .collection(`instances`)
        .getFirstListItem(`id='${_instanceId}' || subdomain='${_instanceId}'`)

      const upload = debounce(() => {
        deployMyCode(instance.subdomain).catch(console.error)
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
        console.log({ path, details })
      }
      watcher.on('add', handle).on('change', handle).on('unlink', handle)
    })
}
