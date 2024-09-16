import { Command } from 'commander'
import { readJSONSync, writeJSONSync } from 'fs-extra/esm'
import { getInstanceBySubdomainCnameOrId } from './../lib/getClient'

export const LinkCommand = () => {
  return new Command(`link`)
    .argument(`<instance>`, `Instance name or ID`)
    .description(`Link a local directory to a remote instance`)
    .action(async (_anyName) => {
      const instance = await getInstanceBySubdomainCnameOrId(_anyName)
      if (!instance) {
        console.error(`Instance not found`)
        process.exit(1)
      }
      console.log(`Instance found: ${instance.subdomain}`)
      const pkg = readJSONSync(`package.json`)
      pkg.pockethost = { instanceId: instance.subdomain }
      console.log(`Writing to package.json`)
      writeJSONSync(`package.json`, pkg, { spaces: 2 })
    })
}
