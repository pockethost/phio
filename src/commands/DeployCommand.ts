import { Command } from 'commander'
import { savedInstanceId } from '../lib/defaultInstanceId'
import { DEFAULT_EXCLUDES, DEFAULT_INCLUDES, deployMyCode } from './DevCommand'

export const DeployCommand = () => {
  return new Command(`deploy`)
    .argument(`[instanceId]`, `Instance name`, savedInstanceId())
    .description(`Deploy to remote`)
    .option(`-v, --verbose`, `Verbose output`)
    .option(
      '-i, --include <include...>',
      'Files to include in the sync',
      (val, prev) => [...prev, val],
      DEFAULT_INCLUDES
    )
    .option(
      '-e, --exclude <exclude...>',
      'Files to exclude from the sync',
      (val, prev) => [...prev, val],
      DEFAULT_EXCLUDES
    )
    .action((instanceId, options) => {
      const { include, exclude, verbose } = options
      deployMyCode(instanceId, include, exclude, verbose)
    })
}
