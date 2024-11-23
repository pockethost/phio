import { config } from '../lib/config'
import { getClient } from '../lib/getClient'

export const ensureLoggedIn = async () => {
  try {
    const token = config(`auth`)!.token
    const client = getClient()
    client.authStore.loadFromCookie(token)
    await client.collection(`users`).authRefresh()
    config(`auth`, {
      token: client.authStore.exportToCookie(),
      record: client.authStore.model,
    })
  } catch (e) {
    console.error(`You must be logged in first. Use 'phio login'`)
    process.exit(1)
  }
}
