import { input, password } from '@inquirer/prompts'
import { Command } from 'commander'
import * as EmailValidator from 'email-validator'
import { config } from '../lib/config'
import { getClient } from './../lib/getClient'
import { runTasks } from './../lib/Task'

export const loginWithUserInput = async () => {
  while (true) {
    const email = await input({
      message: 'Enter your pockethost.io email address',
      default: config('email'),
      validate: (input: string) => {
        if (!EmailValidator.validate(input)) {
          return 'Invalid email address'
        }
        return true
      },
    })

    const pw = await password({
      message: 'Enter your pockethost.io password',
    })

    config(`email`, email)

    const client = getClient()
    try {
      await runTasks([
        {
          name: `Logging in`,
          run: async () => {
            const res = await client
              .collection('users')
              .authWithPassword(email, pw)
          },
        },
      ])
    } catch (e) {
      console.error(
        `There was an error logging in. Please try again or go to https://pockethost.io to reset your password.`
      )
      continue
    }

    config(`auth`, {
      token: client.authStore.exportToCookie(),
      record: client.authStore.model,
    })
    break
  }
  console.log(`Logged in!`)
}

export const LoginCommand = () =>
  new Command('login')
    .description(`Log in to PocketHost`)
    .helpOption(false)
    .action(loginWithUserInput)
