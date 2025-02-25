#!/usr/bin/env tsx
import { program } from 'commander'
import { version } from '../package.json'
import { DeployCommand } from './commands/DeployCommand'
import { DevCommand } from './commands/DevCommand'
import { InfoCommand } from './commands/InfoCommand'
import { LinkCommand } from './commands/LinkCommand'
import { ListCommand } from './commands/ListCommand'
import { LoginCommand } from './commands/LoginCommand'
import { LogsCommand } from './commands/LogsCommand'
import { WhoAmICommand } from './commands/WhoAmICommand'

program
  .name(`PocketHost CLI`)
  .version(version)
  .description(`CLI access to phio`)
  .addCommand(LoginCommand())
  .addCommand(LogsCommand())
  .addCommand(DevCommand())
  .addCommand(WhoAmICommand())
  .addCommand(ListCommand())
  .addCommand(LinkCommand())
  .addCommand(DeployCommand())
  .addCommand(InfoCommand())

// Add error handling
program.exitOverride()

program.parseAsync(process.argv).catch((err) => {
  // Handle specific commander error types
  if (err.code === 'commander.unknownCommand') {
    console.error('Error: Unknown command')
  } else if (err.code === 'commander.missingArgument') {
    console.error('Error: Missing required argument')
  } else {
    console.error('Error:', err.message)
  }
  process.exit(1)
})
