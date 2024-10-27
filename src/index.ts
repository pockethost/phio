import { config } from './lib/config'

export const isLoggedIn = () => {
  return !!config('auth')
}

export * from './commands/DevCommand'
export * from './commands/LinkCommand'
export * from './commands/LoginCommand'
export { config } from './lib/config'
export { getClient } from './lib/getClient'
