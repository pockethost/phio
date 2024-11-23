import PocketBase from 'pocketbase'
import { config } from './config'
import { PHIO_MOTHERSHIP_URL } from './constants'

export const getClient = () => {
  const client = new PocketBase(PHIO_MOTHERSHIP_URL())
  const { record, token } = config('auth') || {}
  // console.log({ record, token })
  if (record && token) {
    client.authStore.loadFromCookie(token)
    // console.log({ valid: client.authStore.isValid })
    client.authStore.onChange((token, record) => {
      config('auth', { token: client.authStore.exportToCookie(), record })
    })
  }
  return client
}

export const getInstanceBySubdomainCnameOrId = async (search: string) => {
  const client = getClient()
  return await client
    .collection(`instances`)
    .getFirstListItem(
      `id='${search}' || subdomain='${search}' || cname='${search}'`
    )
}
