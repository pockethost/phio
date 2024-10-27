import { select } from '@inquirer/prompts'
import { Command } from 'commander'
import { config } from '../lib/config'
import { InstanceFields } from '../lib/InstanceFields'
import { getClient, getInstanceBySubdomainCnameOrId } from './../lib/getClient'

export const isLinked = () => !!config('instanceId')

export const link = async (instanceNameOrId: string) => {
  const instance = await getInstanceBySubdomainCnameOrId(instanceNameOrId)
  if (!instance) {
    return
  }
  config('instanceId', instance.subdomain)
  return instance
}

export const linkWithUserInput = async () => {
  const client = getClient()
  const instances = await client
    .collection(`instances`)
    .getFullList<InstanceFields>()
  while (true) {
    const instanceNameOrId = await select({
      message: `Choose the instance you'd like to link`,
      choices: instances.map((instance) => ({
        name: `${instance.subdomain} (${instance.id}) ${
          instance.cname ? `(${instance.cname})` : ''
        } (${instance.status.toUpperCase()})`,
        value: instance.subdomain,
      })),
    })
    const instance = await link(instanceNameOrId)
    if (!instance) {
      console.error(`Instance not found`)
      continue
    }
    console.log(`Linked ${instance.subdomain}`)
    break
  }
}

export const LinkCommand = () => {
  return new Command(`link`)
    .argument(`[instance]`, `Instance name or ID`)
    .description(`Link a local directory to a remote instance`)
    .action(async (_anyName) => {
      if (_anyName) {
        const instance = await link(_anyName)
        if (!instance) {
          console.error(`Instance ${_anyName} not found`)
          process.exit(1)
        }
        console.log(`Linked ${instance.subdomain}`)
        return
      }
      await linkWithUserInput()
    })
}
