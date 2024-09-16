#!/usr/bin/env tsx
import { program } from 'commander'
import { LoginCommand } from './LoginCommand'
import { version } from '../package.json'
import { LogsCommand } from './LogsCommand'
import { DevCommand } from './DevCommand'

program
  .name(`PocketHost CLI`)
  .version(version)
  .description(`CLI access to phio`)
  .addCommand(LoginCommand())
  .addCommand(LogsCommand())
  .addCommand(DevCommand())

program.parseAsync(process.argv).catch(console.error)
