import { debounce } from '@s-libs/micro-dash'
import { deploy, excludeDefaults } from '@samkirkland/ftp-deploy'
import { IFtpDeployArguments } from '@samkirkland/ftp-deploy/src/types'
import Bottleneck from 'bottleneck'
import { watch } from 'chokidar'
import { Command } from 'commander'
import { ensureDirSync } from 'fs-extra'
import multimatch from 'multimatch'
import { config } from '../lib/config'
import { getInstanceBySubdomainCnameOrId } from '../lib/getClient'
import { savedInstanceId } from './../lib/defaultInstanceId'

export const DEFAULT_INCLUDES = [
  `pb_*`,
  'pb_*/**/*',
  `package.json`,
  `bun.lockb`,
  `patches`,
  `patches/**/*`,
]

export const DEFAULT_EXCLUDES = [`pb_data`, `pb_data/**/*`]

export type DeployOptions = {
  include: string[]
  exclude: string[]
  verbose: boolean
}

export const watchAndDeploy = async (
  _instanceId: string,
  options: DeployOptions = {
    include: DEFAULT_INCLUDES,
    exclude: DEFAULT_EXCLUDES,
    verbose: false,
  }
) => {
  if (!_instanceId) {
    console.error(
      `No instance name provided and none was found in package.json or pockethost.json. Use 'phio link <instance>'`
    )
    process.exit(1)
  }
  console.log(`Dev mode`)
  const { include, exclude, verbose } = options
  // console.log({ include, exclude })

  const instance = await getInstanceBySubdomainCnameOrId(_instanceId)

  const limiter = new Bottleneck({ maxConcurrent: 1 })
  const upload = debounce(
    () =>
      limiter.schedule(() =>
        deployMyCode(instance.subdomain, include, exclude, verbose).catch(
          console.error
        )
      ),
    200
  )

  const watcher = watch('.', {
    persistent: true,
    ignored: (file) => {
      if (file === '.') return false
      const isIncluded = multimatch([file], include).length > 0
      const isExcluded = multimatch([file], exclude).length > 0
      const isIgnored = !isIncluded || isExcluded
      // console.log({
      //   file,
      //   include,
      //   isIncluded,
      //   exclude,
      //   isExcluded,
      //   isIgnored,
      // })
      return isIgnored
    },
  })
  console.log(
    `Watching for changes in ${include.join(', ')} and excluding ${exclude.join(', ')}`
  )
  const handle = (path: string, details: any) => {
    upload()
    // internal
    // console.log(`Syncing ${path}`)
  }
  watcher.on('add', handle).on('change', handle).on('unlink', handle)
}

export async function deployMyCode(
  instanceName: string,
  include: string[],
  exclude: string[],
  verbose: boolean
) {
  const cachePath = '.phiocache'
  ensureDirSync(cachePath)

  console.log('🚚 Deploy started')
  const args: IFtpDeployArguments = {
    server: 'ftp.pockethost.io',
    username: `__auth__`,
    password: config(`auth`)!.token,
    'server-dir': `${instanceName}/`,
    include,
    exclude: [...excludeDefaults, ...exclude],
    'log-level': verbose ? 'verbose' : 'standard',
  }

  console.log({ args })

  await deploy(args)
  console.log('🚀 Deploy done!')
}

export const DevCommand = () => {
  return new Command('dev')
    .argument(`[instanceId]`, `Instance name`, savedInstanceId())
    .description(`Watch for local modifications and sync to remote`)
    .option(`-v, --verbose`, `Verbose output`)
    .option(
      '-i, --include <include...>',
      'Files to include in the sync',
      (val, prev) => [...prev, ...val.split(',')],
      DEFAULT_INCLUDES
    )
    .option(
      '-e, --exclude <exclude...>',
      'Files to exclude from the sync',
      (val, prev) => {
        return [...prev, ...val.split(',')]
      },
      DEFAULT_EXCLUDES
    )
    .action(watchAndDeploy)
}
