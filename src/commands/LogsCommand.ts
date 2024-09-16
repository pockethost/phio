import { Command } from 'commander'
import { config } from '../lib/config'
//@ts-ignore
import { fetchEventSource } from '@sentool/fetch-event-source'

export enum StreamNames {
  StdOut = 'stdout',
  StdErr = 'stderr',
}

export type InstanceLogFields = {
  message: string
  time: string
  stream: StreamNames
}
const watchInstanceLog = (
  instanceId: string,
  update: (log: InstanceLogFields) => void,
  nInitial = 100
): (() => void) => {
  const controller = new AbortController()
  const signal = controller.signal
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

        update(data)
      },
      onopen: async (response: Response) => {
        // console.log(response)
      },
      onerror: (e: Error) => {
        console.error(`got an error`, e)
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
    .argument('<instance>', 'Instance ID')
    .action((instance) => {
      watchInstanceLog(instance, (log) => {
        const { time, message, stream } = log
        if (stream === 'stderr') {
          console.error(`[${time}] ${message}`)
        } else {
          console.log(`[${time}] ${message}`)
        }
      })
    })
}
