import { Command } from 'commander'
import { config } from '../lib/config'
import { PHIO_HOME } from '../lib/constants'

export const InfoCommand = () => {
  return new Command(`info`).description(`Get config info`).action(() => {
    console.log(`Config root: ${PHIO_HOME()}`)
    console.log(`Instance: ${config('instanceId')}`)
  })
}
