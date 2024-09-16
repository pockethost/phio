#!/usr/bin/env tsx
import { program } from 'commander'
import { LoginCommand } from './commands/LoginCommand'
import { version } from '../package.json'
import { LogsCommand } from './commands/LogsCommand'
import { DevCommand } from './commands/DevCommand'
import { WhoAmICommand } from './commands/WhoAmICommand'
import { ListCommand } from './commands/ListCommand'

program
  .name(`PocketHost CLI`)
  .version(version)
  .description(`CLI access to phio`)
  .addCommand(LoginCommand())
  .addCommand(LogsCommand())
  .addCommand(DevCommand())
  .addCommand(WhoAmICommand())
  .addCommand(ListCommand())

program.parseAsync(process.argv).catch(console.error)
