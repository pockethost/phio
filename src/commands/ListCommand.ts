import { Command } from 'commander'
import { getClient } from './../lib/getClient'
import { InstanceFields } from './../lib/InstanceFields'

export const ListCommand = () => {
  return new Command(`list`)
    .description(`List all the logs`)
    .action(async () => {
      const client = getClient()
      const instances = await client
        .collection(`instances`)
        .getFullList<InstanceFields>()
      instances.forEach((instance) => {
        console.log(
          `- ${instance.subdomain} (${instance.id}) ${
            instance.cname ? `(${instance.cname})` : ''
          } (${instance.status.toUpperCase()})`
        )
      })
    })
}
