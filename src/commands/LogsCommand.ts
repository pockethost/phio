import { fetchEventSource } from '@sentool/fetch-event-source'
import { Command } from 'commander'
import { config } from '../lib/config'
import { savedInstanceName } from '../lib/defaultInstanceId'
import { ensureLoggedIn } from '../lib/ensureLoggedIn'

export enum StreamNames {
  StdOut = 'stdout',
  StdErr = 'stderr',
}

export type InstanceLogFields = {
  message: string
  time: string
  stream: StreamNames
}

type Unsubscribe = () => void

const watchInstanceLog = async (
  instanceId: string,
  update: (log: InstanceLogFields) => void,
  nInitial = 100
): Promise<Unsubscribe> => {
  const controller = new AbortController()
  const signal = controller.signal

  await ensureLoggedIn()

  const continuallyFetchFromEventSource = () => {
    const url = `https://${instanceId}.pockethost.io/logs`
    const body = {
      instanceId,
      n: nInitial,
      auth: config(`auth`)!.token,
    }

    fetchEventSource(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      openWhenHidden: true,
      body: JSON.stringify(body),
      onmessage: (event: any) => {
        const { data } = event
        if (!data) return
        update(data)
      },
      onopen: async (response: Response) => {
        // console.log(response)
      },
      onerror: (e: Error) => {
        setTimeout(continuallyFetchFromEventSource, 100)
      },
      onclose: () => {
        console.log(`closed`)
        setTimeout(continuallyFetchFromEventSource, 100)
      },
      signal,
    })
  }
  continuallyFetchFromEventSource()

  return () => {
    controller.abort()
  }
}

export const LogsCommand = () => {
  return new Command('logs')
    .description(`Tail instance logs`)
    .argument('[instance]', 'Instance ID', savedInstanceName())
    .action((instance) => {
      watchInstanceLog(instance, (log) => {
        const { time, message, stream } = log
        if (stream === 'stderr') {
          console.error(`[${time}] ${message}`)
        } else {
          console.log(`[${time}] ${message}`)
        }
      }).catch((e) => {
        console.error(`Error fetching logs`, e)
      })
    })
}
